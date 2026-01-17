import './globals.css';

/* Logical properties are encouraged */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // The locale will be handled by the [locale] layout, but this root layout is required.
        // We can just pass through children. The middleware ensures we are in a locale.
        // suppressHydrationWarning is needed because of browser extensions/environment scripts
        // (like 'antigravity-scroll-lock') that inject attributes into body.
        <body suppressHydrationWarning>
            {children}
        </body>
    );
}
