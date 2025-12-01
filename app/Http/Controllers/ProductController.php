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
use Illuminate\Validation\Rule;



class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('prd_name', 'like', "%{$search}%")
                    ->orWhere('prd_description', 'like', "%{$search}%")
                    ->orWhere('prd_price', 'like', "%{$search}%")
                    ->orWhere('prd_stock', 'like', "%{$search}%")
                    ->orWhere('created_at', 'like', "%{$search}%")
                    ->orWhere('updated_at', 'like', "%{$search}%");
            });
        }

        $products = $query->orderBy('prd_id', 'desc')->paginate(12);

        return inertia('Products/Index', [
            'products' => $products,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Products/Create', [
            'auth' => ['user' => $request->user()],
        ]);
    }

    public function edit(Product $product, Request $request)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'auth' => ['user' => $request->user()],
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'prd_name' => 'required|string|max:255|unique:products,prd_name',
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

            'prd_name' => 'required|string',
            'prd_price' => 'nullable|numeric',
            'prd_stock' => 'nullable|integer',
            'prd_description' => 'nullable|string',
            'prd_img' => 'nullable|image|max:2048',
        ]);

        // ❗ Jika tidak upload gambar → pertahankan gambar lama
        if (!$request->hasFile('prd_img')) {
            $data['prd_img'] = $product->prd_img;
        }

        // Jika upload gambar baru
        if ($request->hasFile('prd_img')) {

            // Hapus gambar lama
            if ($product->prd_img && Storage::exists("public/" . $product->prd_img)) {
                Storage::delete("public/" . $product->prd_img);
            }

            $image = $request->file('prd_img');
            $filename = time() . '.jpg';

            $manager = new ImageManager(new Driver());
            $img = $manager->read($image)
                ->scale(width: 800)
                ->encodeByExtension('jpg', quality: 75);

            Storage::put("public/products/" . $filename, (string) $img);

            $data['prd_img'] = "products/" . $filename;
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
