import RootLayout from "@/components/RootLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Provider } from "react-redux";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Clerk } from "@clerk/nextjs/dist/types/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ClerkProvider {...pageProps} publishableKey={publishableKey}>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {/* <SessionProvider session={session}> */}
          <div className="font-bodyFont bg-gray-300">
            <RootLayout>
              <Component {...pageProps} />
            </RootLayout>
          </div>
        {/* </SessionProvider> */}
      </PersistGate>
    </Provider>
    </ClerkProvider>
  );
}
