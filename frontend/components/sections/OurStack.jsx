"use client";
import H1 from "@/components/ui/H1";
import P from "@/components/ui/P";
import DomeGallery from "../DomeGallery";

const OurStack = () => {
    return (
        <section
            id="our-stack"
            className="flex w-full flex-col items-center justify-center py-16 px-4 sm:px-16  bg-section gap-6"
        >
            <H1>The Stack Behind the Work</H1>
            <P variant="muted" className="max-w-2xl text-center mb-2">
                Every project is built on a foundation of modern, battle-tested technologies — chosen for performance, scalability, and long-term maintainability.
            </P>
            <div id="logoloop" className="flex flex-col relative h-[50vh] items-center justify-center w-full md:w-[50%]">
                <DomeGallery
                    // images={{}}
                    fit={0.5}
                    minRadius={300}
                    maxVerticalRotationDeg={20}
                    segments={20}
                    dragDampening={2}
                    // grayscale
                    overlayBlurColor="section"
                />
            </div>
        </section>
    )
}

export default OurStack