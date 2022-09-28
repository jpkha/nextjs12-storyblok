import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {apiPlugin, storyblokInit} from "@storyblok/react";
import {StoryblokComponents} from "../components/components-list";

storyblokInit({
  accessToken: process.env.STORYBLOK_TOKEN,
  use: [apiPlugin],
  components: StoryblokComponents
})


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
