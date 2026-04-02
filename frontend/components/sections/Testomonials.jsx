"use client";
import H1 from "@/components/ui/H1";
import TestCard from "../TestCard";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    EffectCoverflow,
    EffectCards,
    Navigation,
    Pagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import testimonials from "@/data/dynamic/testimonials";
import LogoLoop from "../LogoLoop";
import P from "@/components/ui/P";

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import DomeGallery from "../DomeGallery";
const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

const Testomonials = () => {
    return (
        <section
            id="testomonials"
            className="flex min-h-screen w-full flex-col items-center justify-center py-16 px-4 sm:px-16  bg-section"
        >
            <H1>testomonials</H1>
            <P variant="muted" className="max-w-2xl text-center mb-2">
                Trusted by teams building modern digital products. We focus on quality delivery,
                clear communication, and measurable business results.
            </P>

            <div className="flex w-full flex-col md:flex-row items-center justify-center overflow-hidden h-full ">
                <div id="swiper" className="flex flex-col relative w-full md:w-[50%] h-[50vh] items-center justify-center ">
                    <P
                        as="span"
                        variant="eyebrow"
                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] sm:text-xs"
                        style={{
                            border: "1px solid color-mix(in srgb, var(--border) 75%, transparent)",
                            background: "color-mix(in srgb, var(--card) 45%, transparent)",
                        }}
                    >
                        What our clients said
                    </P>
                    <Swiper
                        modules={[Pagination, Autoplay, EffectCards]}
                        loop={false}
                        spaceBetween={0}
                        pagination={{ dynamicBullets: true }}
                        effect="cards"
                        autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        cardsEffect={{
                            perSlideOffset: 8,
                            perSlideRotate: 2,
                            rotate: true,
                            slideShadows: false,
                        }}
                        grabCursor={true}
                        mousewheel={{ invert: false }}
                        initialSlide={0}
                        speed={500}
                        slidesPerView={1}
                        className="rounded-3xl p-9 w-full"
                    >
                        {testimonials.map((testimonial, i) => (
                            <SwiperSlide key={i} className="p-5">
                                <TestCard {...testimonial} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div id="logoloop" className="flex flex-col relative w-full h-[50vh] items-center justify-center  ">
                    <P
                        as="span"
                        variant="eyebrow"
                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] sm:text-xs"
                        style={{
                            border: "1px solid color-mix(in srgb, var(--border) 75%, transparent)",
                            background: "color-mix(in srgb, var(--card) 45%, transparent)",
                        }}
                    >
                        our clients
                    </P>
                    <DomeGallery
                        // images={{}}
                        fit={0.5}
                        minRadius={300}
                        maxVerticalRotationDeg={0}
                        segments={20}
                        dragDampening={2}
                        // grayscale
                        overlayBlurColor="section"
                    />
                </div>
            </div>
        </section>
    );
};

export default Testomonials;
