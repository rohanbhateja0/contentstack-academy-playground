'use client';

import React, { useState, useEffect } from 'react';
import { onEntryChange } from '../../contentstack-sdk';
import { getAllMarvelActors, metaData } from '../../helper';
import { Page, PostPage } from "../../typescript/pages";
import GalleryReact from '../../components/gallery'
import { usePathname } from 'next/navigation';
import HeroBanner from '@/components/hero-banner';

export default function MarvelActors() {
    const entryUrl = usePathname();

    const [getBanner, setBanner] = useState<Page>();
    const [archivePost, setArchivePost] = useState<PostPage>();
    const [posts, setPosts] = useState<PostPage>();
    async function fetchData() {

        try {
            const bannerRes = await getAllMarvelActors(entryUrl);
            if (!bannerRes) throw new Error('Status code 404');
            setBanner(bannerRes);
            const archivePostRes = [] as any;
            const postsRes = [] as any;

            bannerRes?.marvel_actors?.forEach((actor: { is_archived: any; }) => {
                if (actor.is_archived) {
                    archivePostRes.push(actor);
                } else {
                    postsRes.push(actor);
                }
            });

            setArchivePost(archivePostRes);
            setPosts(postsRes);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        onEntryChange(() => fetchData());
    }, []);

    return (
        <>
            {getBanner?.seo && getBanner.seo.enable_search_indexing && metaData(getBanner.seo)}
            {getBanner?.hero_banner_modular_block && getBanner.hero_banner_modular_block.length > 0 && (
                <HeroBanner banner={getBanner.hero_banner_modular_block[0]} />
            )}
            <GalleryReact
                data={posts}
                heading={getBanner?.heading}
                description={getBanner?.description}
                showFilter={false}
                showDescription
            />
        </>
    );
}