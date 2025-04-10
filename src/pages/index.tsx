import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "../components/loadingScreen/LoadingScreen";
import Script from "next/script";

const Home: NextPage = () => {
  const router = useRouter();
  const currentRoute = router.pathname;

  useEffect(() => {
    const userId = localStorage.getItem("userId") || ""
    if (userId === "") {
      console.log('userId1=====================================',userId)
      if (currentRoute.includes('interview') && currentRoute.includes('interview-form')) {
        return
      } else {
        localStorage.clear()
        router.push('/login')
      }
    }
    else {
      console.log('userId2=====================================',userId)

      router.push('/job-listing')
    }

  }, [router, currentRoute]);

  return (
    <>
      <Head>
        <title>AI Interview</title>
      </Head>
      {/* Google tag (gtag.js) */}
      <Script strategy="lazyOnload" async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}></Script>
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}',{
          page_path:window.location.pathname,
          })
        `}
      </Script>

      <div
      >
        <LoadingScreen />
      </div>

    </>
  );
};
export default Home;
