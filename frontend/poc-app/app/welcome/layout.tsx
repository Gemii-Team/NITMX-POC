import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function LayoutHome ({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};