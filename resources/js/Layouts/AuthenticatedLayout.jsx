import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import {
    Typography,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
} from "@heroicons/react/24/solid";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="flex w-full bg-gray-100 overflow-x-hidden">
            <div className="fixed top-0 left-0 h-screen min-w-[20rem] bg-sky-500 shadow-[4px_0px_12px_rgba(0,0,0,0.12)] rounded-r-xl flex flex-col justify-between">
                <Link href={"/"}>
                    <div className="mb-2 p-[34px] hover:bg-sky-400 transition border-b-[3px] border-white rounded-tr-xl">
                        <Typography variant="h5" color="blue-gray">
                            <div className="bg-white inline-block text-transparent bg-clip-text font-bold text-4xl font-sans">
                                Lediashier
                            </div>
                        </Typography>
                    </div>
                </Link>

                <List className="flex flex-col justify-between h-full p-[40px]">
                    <div className="flex flex-col">
                        <Link href={route('dashboard')}>
                            <ListItem className="hover:bg-sky-400 transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className="h-7 w-7 me-4 text-white " />
                                </ListItemPrefix>
                                <p className="text-2xl text-white font-medium">Dashboard</p>
                            </ListItem>
                        </Link>

                        <Link href={route('products.index')}>
                            <ListItem className="hover:bg-sky-400 transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                                <ListItemPrefix>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 me-4 text-white">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </ListItemPrefix>
                                <p className="text-2xl text-white font-medium">Products</p>
                            </ListItem>
                        </Link>
                        <Link href={route('transactions.index')}>
                            <ListItem className="hover:bg-sky-400 transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                                <ListItemPrefix>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 me-4 text-white">
                                        <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                                    </svg>

                                </ListItemPrefix>
                                <p className="text-2xl text-white font-medium">Transaction</p>
                            </ListItem>
                        </Link>
                    </div>

                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="hover:bg-sky-400 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                    >
                        <ListItem className="hover:bg-sky-400 transition hover:">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 text-white font-bold">
                                <path
                                    fillRule="evenodd"
                                    d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-2xl text-white font-medium">Log Out</p>
                        </ListItem>
                    </Link>
                </List>
            </div>

            <div className="flex flex-col flex-1 min-h-screen ml-[20rem] overflow-y-auto overflow-x-hidden">
                {header && (
                    <header className="flex items-center justify-between bg-white w-full shadow py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
                        <div className="w-full font-bold text-2xl">{header}</div>
                        <div className="w-fit">
                            <p className="whitespace-nowrap text-lg">
                                Hello, <b>{user.usr_name}</b>
                            </p>
                        </div>
                    </header>
                )}

                <main className="p-4 flex flex-col ">{children}</main>
            </div>
        </div>
    );
}
