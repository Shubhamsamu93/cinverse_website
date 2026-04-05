import React, { useEffect, useRef, useState } from "react";

import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Button, { OutlineButton } from "./../button/Button";
import Modal, { ModalContent } from "./../modal/Modal";

import tmdbApi, { category, movieType } from "./../../api/tmdbApi";
import apiConfig from "./../../api/apiConfig";

import "./hero-slide.scss";
import { useNavigate } from "react-router-dom";

import * as Config from "./../../constants/Config";

const HeroSlide = () => {
  SwiperCore.use([Autoplay]);

  const [movieItems, setMovieItems] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      const params = { page: 1 };
      try {
        const response = await tmdbApi.getMoviesList(movieType.popular, {
          params,
        });
        setMovieItems(response.results.slice(0, 4));
        console.log(response);
      } catch {
        console.log("error");
      }
    };
    getMovies();
  }, []);

  const openModal = async (itemId) => {
    setActiveModal(itemId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
      >
        {movieItems.map((item, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              // eslint-disable-next-line jsx-a11y/alt-text
              <HeroSlideItem
                item={item}
                className={`${isActive ? "active" : ""}`}
                onTrailerClick={openModal}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {movieItems.map((item, index) => (
        <TrailerModal
          key={index}
          item={item}
          active={activeModal === item.id}
          onClose={closeModal}
        />
      ))}
    </div>
  );
};

const HeroSlideItem = (props) => {
  let navigate = useNavigate();

  const item = props.item;

  const background = apiConfig.originalImage(
    item.backdrop_path ? item.backdrop_path : item.poster_path
  );

  const handleTrailerClick = async () => {
    props.onTrailerClick(item.id);
  };

  return (
    <div
      className={`hero-slide__item ${props.className}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="hero-slide__item__content container">
        <div className="hero-slide__item__content__info">
          <h2 className="title">{item.title}</h2>
          <div className="overview">{item.overview}</div>
          <div className="btns">
            <Button
              onClick={() =>
                navigate(`/${Config.HOME_PAGE}/movie/` + item.id)
              }
            >
              Watch now
            </Button>
            <OutlineButton onClick={handleTrailerClick}>
              Watch trailer
            </OutlineButton>
          </div>
        </div>

        <div className="hero-slide__item__content__poster">
          <img src={apiConfig.w500Image(item.poster_path)} alt="" />
        </div>
      </div>
    </div>
  );
};

const TrailerModal = (props) => {
  const item = props.item;
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    if (props.active) {
      const loadVideo = async () => {
        try {
          const videos = await tmdbApi.getVideos(category.movie, item.id);
          if (videos.results.length > 0) {
            setVideoSrc("https://www.youtube.com/embed/" + videos.results[0].key);
          } else {
            setVideoSrc("");
          }
        } catch (error) {
          console.error("Error loading video:", error);
          setVideoSrc("");
        }
      };
      loadVideo();
    }
  }, [props.active, item.id]);

  const handleClose = () => {
    setVideoSrc("");
    props.onClose();
  };

  return (
    <Modal active={props.active} id={`modal_${item.id}`}>
      <ModalContent onClose={handleClose}>
        {videoSrc ? (
          <iframe
            width="100%"
            height="500px"
            src={videoSrc}
            title="trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            No trailer available
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default HeroSlide;
