"use client";
import H1 from "@/components/ui/H1";
import TestCard from "../TestCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import testimonials from "@/data/dynamic/testimonials";
import P from "@/components/ui/P";

const Testomonials = () => {
  return (
    <section
      id="testomonials"
      className="relative flex w-full flex-col items-center justify-center py-16 px-4 sm:px-16 overflow-hidden gap-4"
    >
      <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-96 rounded-full bg-white/5 blur-3xl opacity-90 pointer-events-none z-0" />
      <H1>What Our Clients Say</H1>
      <P variant="muted" className="max-w-2xl text-center mb-2">
        We don't just deliver code — we deliver results. Here's what the people
        we've worked with have to say about the experience.
      </P>
      <div
        id="swiper"
        className="flex flex-col relative w-full  items-center justify-center"
      >
        <Swiper
          modules={[Pagination, Autoplay, EffectCards]}
          loop={false}
          spaceBetween={0}
          pagination={{ dynamicBullets: true }}
          effect="cards"
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          cardsEffect={{
            perSlideOffset: 8,
            perSlideRotate: 2,
            rotate: true,
            slideShadows: false,
          }}
          grabCursor={true}
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
    </section>
  );
};

export default Testomonials;
