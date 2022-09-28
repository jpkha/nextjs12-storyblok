import type { NextPage } from "next";
import {
    useStoryblokState,
    getStoryblokApi,
    StoryblokComponent,
} from "@storyblok/react";
import Head from "next/head";
import {PageProps} from "../models/page-props.model";
import styles from "../styles/Home.module.css";
import {SbBlokData} from "@storyblok/js";

const HomePage: NextPage<PageProps> = (props) => {
    const story = useStoryblokState(props.story, {preventClicks: true});
    return (
        <div className={styles.container}>
            <Head>
                <title>{story ? story.name : "Nextjs - Storyblok"}</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <StoryblokComponent blok={story.content as SbBlokData} />
        </div>
    );
};
export async function getStaticProps() {
    // home is the default slug for the homepage in Storyblok
    let slug = "home";

    // load the draft version
    let sbParams = {
        version: "draft", // or 'published'
    };

    const storyblokApi = getStoryblokApi();
    let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

    return {
        props: {
            story: data ? data.story : false,
            key: data ? data.story.id : false,
        },
        revalidate: 3600, // revalidate every hour
    };
}
export default HomePage;
