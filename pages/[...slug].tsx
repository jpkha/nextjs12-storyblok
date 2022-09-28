import Head from "next/head";
import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import { StoryData } from "storyblok-js-client";
import {
    useStoryblokState,
    getStoryblokApi,
    StoryblokComponent
} from "@storyblok/react";
import {SbBlokData} from "@storyblok/js";
import {ParsedUrlQuery} from "querystring";

interface PageProps {
    story: StoryData;
}

interface IParams extends ParsedUrlQuery {
    slug: string[];
}

interface SbStaticPath {

      params: {
          slug: string[]
      }
}
export const Page:NextPage<PageProps> = (props) => {
    const story = useStoryblokState(props.story, {preventClicks: true});

    return (
        <>
            <Head>
                <title>{story ? story.name : "Nextjs - Storyblok"}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <StoryblokComponent blok={story.content as SbBlokData}/>
        </>
    );
}

export const getStaticProps: GetStaticProps= async ({ params }) => {
    const { slug: paramsSlug } = params as IParams;
    let slug = paramsSlug ? paramsSlug.join("/") : "home";


    let sbParams = {
        version:  process.env.STORYBLOK_VERSION ?? "draft", // or 'published'
        resolve_relations: "global_reference.reference"
    };


    const storyblokApi = getStoryblokApi();
    let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);
    return {
        props: {
            story: data ? data.story : false,
            key: data ? data.story.id : false,
            rels: data ? data.rels : false
        },
        revalidate: 3600
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const storyblokApi = getStoryblokApi();
    let { data } = await storyblokApi.get("cdn/links",  { version: process.env.STORYBLOK_VERSION ?? "draft" });

    let paths: SbStaticPath[] = [] as SbStaticPath[];
    Object.keys(data.links).forEach((linkKey) => {
        if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
            return;
        }

        const slug = data.links[linkKey].slug;
        let splittedSlug = slug.split("/");
        paths.push({ params: { slug: splittedSlug } });
    });

    return {
        paths,
        fallback: false
    };
}

export default Page;