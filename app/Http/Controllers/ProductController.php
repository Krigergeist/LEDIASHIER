<?php


namespace App\Http\Controllers;


use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;



class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->search) {
            $query->where('prd_name', 'like', "%{$request->search}%")
                ->orWhere('prd_code', 'like', "%{$request->search}%")
                ->orWhere('prd_description', 'like', "%{$request->search}%");
        }

        // Ambil hanya 10 item per halaman
        $products = $query->orderBy('prd_id', 'desc')->paginate(12);

        return inertia('Products/Index', [
            'products' => $products,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'prd_name' => 'required|string|max:255',
            'prd_code' => 'required|string|max:255|unique:products,prd_code',
            'prd_price' => 'required|numeric',
            'prd_stock' => 'required|integer',
            'prd_description' => 'nullable|string',
            'prd_img' => 'nullable|image|mimes:jpg,jpeg,png|max:4096',
        ]);

        if ($request->hasFile('prd_img')) {
            $image = $request->file('prd_img');
            $filename = time() . '.jpg';

            $manager = new ImageManager(new Driver());

            $img = $manager->read($image)
                ->scale(width: 800)
                ->encodeByExtension('jpg', quality: 75);

            Storage::put('public/products/' . $filename, (string) $img);

            $validated['prd_img'] = 'products/' . $filename;
        }

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan!');
    }



    public function show(Product $product)
    {
        return Inertia::render('Products/Show', ['product' => $product]);
    }


    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'prd_code' => "required|unique:products,prd_code,{$product->id}",
            'prd_name' => 'required|string',
            'prd_price' => 'nullable|numeric',
            'prd_stock' => 'nullable|integer',
            'prd_description' => 'nullable|string',
            'prd_img' => 'nullable|image|max:2048',
        ]);


        if ($request->hasFile('prd_img')) {
            if ($product->prd_img && Storage::exists('public/' . $product->prd_img)) {
                Storage::delete('public/' . $product->prd_img);
            }

            $image = $request->file('prd_img');
            $filename = time() . '.jpg';

            $manager = new ImageManager('gd');
            $img = $manager->read($image)
                ->scale(width: 800)
                ->encodeByExtension('jpg', quality: 75);

            Storage::put('public/products/' . $filename, (string) $img);
            $validated['prd_img'] = 'products/' . $filename;
        }



        $product->update($data);




        return Redirect::route('products.index')->with('success', 'Produk berhasil diupdate');
    }
    public function destroy(Product $product)
    {
        $product->delete();
        return Redirect::route('products.index')->with('success', 'Produk berhasil dihapus (soft delete)');
    }
}
