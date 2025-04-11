import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { EffectCoverflow } from "swiper/modules";
import { EffectCube } from "swiper/modules";
import { EffectFlip } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const SwiperCarousel = ({ images }) => {
  return (
    <>
      <style>
        {`
          .swiper-button-prev,
          .swiper-button-next {
            color: rgb(153 27 27 / var(--tw-bg-opacity, 1)) !important;
            font-size: 40px !important;
            width: 50px !important;
            height: 50px !important;
          }

          .swiper-button-prev::after,
          .swiper-button-next::after {
            font-size: 30px !important;
          }

          .swiper-pagination-bullet {
            background: gray;
          }

          .swiper-pagination-bullet-active {
            background: rgb(153 27 27 / var(--tw-bg-opacity, 1)) !important;
          }
        `}
      </style>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        // effect="cube"
        // modules={[Autoplay, Pagination, Navigation, EffectCube]}
        // effect="flip"
        // modules={[Autoplay, Pagination, Navigation, EffectFlip]}
        // effect="coverflow"
        // modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        // coverflowEffect={{
        //   rotate: 50,
        //   stretch: 0,
        //   depth: 100,
        //   modifier: 1,
        //   slideShadows: true,
        // }}
        speed={2000}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="mySwiper"
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full min-h-[400px] h-[85vh] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperCarousel;
