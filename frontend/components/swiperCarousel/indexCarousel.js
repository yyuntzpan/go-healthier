import React from 'react'
import CardCarousel from './cardCarousel'
import Btn from '../articles/buttons_test'
import styles from './index-carousel.module.css'

export default function IndexCarousel({
  title,
  data = [],
  renderItem = () => {},
  cardMaxWidth = '270px',
  showBtn = true,
  separator = true,
  btnText = '找課程',
}) {
  return (
    <>
      <div className={`${styles.carouselRow} row px-0 mx-0 g-0`}>
        <div className="col-md-3 d-flex justify-content-md-end justify-content-center align-items-center">
          <h3 className="my-0">{title}</h3>
        </div>
        <div className="col-md-9 ps-3 py-5 overflow-hidden">
          <CardCarousel
            cardMaxWidth={cardMaxWidth}
            data={data}
            renderItem={renderItem}
          >
            <div
              className={`${styles.swiperSeparator} ${
                separator ? 'd-block' : 'd-none'
              }`}
            ></div>
          </CardCarousel>
        </div>
      </div>
      <div className={showBtn ? 'row px-0 mx-0 g-0' : 'd-none'}>
        <div
          className={`${styles.carouselBtnPC} d-none d-md-flex justify-content-center`}
        >
          <Btn
            size="lg"
            bgColor="midnightgreen"
            btnOrLink="link"
            hrefURL="/lessons"
            maxWidth="312px"
          >
            {btnText}
          </Btn>
        </div>
        <div
          className={`${styles.carouselBtnSP} d-md-none d-flex justify-content-end`}
        >
          <Btn
            size="thin2"
            bgColor="midnightgreen"
            btnOrLink="link"
            hrefURL="/lessons"
            maxWidth="210px"
            borderRadius="50px 0 0 50px"
            // marginRight="-24px"
          >
            找課程
          </Btn>
        </div>
      </div>
    </>
  )
}
