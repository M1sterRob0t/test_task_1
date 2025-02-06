import { useRef, useState, useEffect, CSSProperties } from 'react';
import gsap from "gsap";
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { sliderData } from '../../constants/sliderData';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './Slider.scss';


function Slider() {
  const numberOfEvents = sliderData.length;
  const angleBetweenDots = 360 / numberOfEvents;
  const defaultTimeOfRotation = 300;

  const sliderRef = useRef<HTMLDivElement>(null);
  const mainCircleRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState<number>(angleBetweenDots);
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [timeOfRotation, setTimeOfRotation] = useState<number>(defaultTimeOfRotation);
  const [startDate, setStartDate] = useState<number>(Number(sliderData[0].events[0].date));
  const [endDate, setEndDate] = useState<number>(Number(sliderData[0].events[sliderData.length - 1].date));

  useEffect(() => {
    const timer = setTimeout(() => {
      sliderRef.current?.classList.add("slider_show");
      clearTimeout(timer);
    }, 300);
  }, [currentEvent]);

  function getTotal(length: number, index: number): string {
    return `${String(index + 1).padStart(2, '0')}/${String(length).padStart(2, '0')}`;
  }

  function fadeIt(fn: () => void): void {
    sliderRef.current?.classList.remove("slider_show");
    const timer = setTimeout(() => {
      fn();
      clearTimeout(timer);
    }, 300);
  }

  function loadPrev(): void {
    loadThis(currentEvent - 1);
  }

  function loadNext(): void {
    loadThis(currentEvent + 1);
  }

  function animateDatesRange(index: number): void {
    const newStartDate = Number(sliderData[index].events[0].date);
    const startRange = newStartDate - startDate;
    const newEndDate = Number(sliderData[index].events[sliderData.length - 1].date);
    const endRange = newEndDate - endDate;
    const animationTime = (timeOfRotation + 300) / 1000;

    gsap.to(startDateRef.current, {
      duration: animationTime,
      textContent: `+=${startRange}`,
      roundProps: "textContent",
      ease: "none",
      onUpdate: () => setStartDate(newStartDate)
    });
    gsap.to(endDateRef.current, {
      duration: animationTime,
      textContent: `+=${endRange}`,
      roundProps: "textContent",
      ease: "none",
      onUpdate: () => setEndDate(newEndDate)
    });
  }

  function loadThis(index: number): void {

    animateDatesRange(index);

    mainCircleRef.current?.children[index].classList.add("spinner__shoulder_active");

    const angleOfRotation = angleBetweenDots - index * angleBetweenDots;
    setTimeOfRotation(Math.abs(currentEvent - index) * defaultTimeOfRotation);
    const timer = setTimeout(() => {
      setAngle(angleOfRotation);
      clearTimeout(timer);
    }, 300);

    fadeIt(() => setCurrentEvent(index));
  }

  return (
    <main className='main'>
      <section className='historic-dates'>
        <h1 className='historic-dates__heading'>Исторические даты</h1>
        <div className="historic-dates__range range">
          <p className='range_start' ref={startDateRef}>{startDate}</p>
          <p className='range_end' ref={endDateRef}>{endDate}</p>
        </div>
        <div className="historic-dates__spinner spinner">
          <div ref={mainCircleRef} className='spinner__main-circle'
            style={{
              "--count": numberOfEvents,
              "--angle": angle + "deg",
              "--time": timeOfRotation + "ms",
              "--delay": timeOfRotation + 300 + "ms",
            } as CSSProperties}>
            {
              sliderData.map((item, index) => {
                const { title } = item;
                const idx = index + 1;
                return (
                  <div key={index} className={"spinner__shoulder " + (currentEvent === index ? 'spinner__shoulder_active' : '')}
                    style={{ "--i": idx } as CSSProperties}
                    onClick={() => loadThis(index)}
                  >
                    <div className='spinner__circle-area'>
                      <p className='spinner__circle'>{idx}
                        <span className='spinner__title'>{title}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="historic-dates__navigation navigation">
          <p className='navigation__total'>{getTotal(numberOfEvents, currentEvent)}</p>
          <div className='navigation__buttons control-buttons'>
            <button
              className='control-buttons__default control-buttons__prev'
              onClick={loadPrev}
              disabled={currentEvent === 0 ? true : false}
            >
            </button>
            <button
              className='control-buttons__default control-buttons__next'
              onClick={loadNext}
              disabled={currentEvent === numberOfEvents - 1 ? true : false}
            >
            </button>
          </div>
        </div>
        <div ref={sliderRef} className="historic-dates__slider slider">
          <p className='slider__mobile-title'>{sliderData[currentEvent].title}</p>
          <button className='slider__btn slider__btn_prev'></button>
          {
            <Swiper
              modules={[Navigation]}
              spaceBetween={80}
              slidesPerView={4}
              breakpoints={{
                320: {
                  slidesPerView: 1.5,
                  spaceBetween: 25
                },
                769: {
                  slidesPerView: 3,
                  spaceBetween: 80
                },
                1025: {
                  slidesPerView: 4,
                  spaceBetween: 80
                }
              }}
              navigation={{
                prevEl: '.slider__btn_prev',
                nextEl: '.slider__btn_next',
              }}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {
                sliderData[currentEvent].events
                  .map((item, index) => {
                    const { date, description } = item;
                    return (
                      <SwiperSlide key={index} className='slider__slide'>
                        <p className='slider__year'>{date}</p>
                        <p className='slider__description'>{description}</p>
                      </SwiperSlide>
                    );
                  })
              }
            </Swiper>
          }
          <button className='slider__btn slider__btn_next'></button>
        </div>
        <div className='events__control-buttons'>
          {
            sliderData.map((item, index) => {
              return <button
                className={"events__button " + (currentEvent === index ? 'events__button_active' : '')}
                key={index}
                onClick={() => loadThis(index)}
              ></button>
            })
          }
        </div>
      </section>
    </main>
  );
}

export default Slider;
