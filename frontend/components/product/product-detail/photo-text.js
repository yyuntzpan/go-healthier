import React from 'react'
import Image from 'next/image'
import styles from './detail-text.module.css'

export default function PhotoText({ photodata = [], desc }) {
  console.log(photodata)
  return (
    <>
      <div
        className="container"
        style={{ backgroundColor: '#FFF7E9', borderRadius: '30px' }}
      >
        <h2 className="col-12 text-center my-5">產品特性</h2>
        {photodata.length > 0 &&
          photodata.map((v, i) => (
            <div key={i} className="row text-center align-items-center">
              {i % 2 === 0 ? (
                <>
                  <div className="col-md-6 mt-5">
                    <h2>主要特色</h2>
                    <p>{desc}</p>
                  </div>
                  <div className="col-md-6">
                    <img
                      className="w-75"
                      src={`/product-img/${v}`}
                      alt=""
                      style={{
                        borderRadius: '50px 50px 50px 0px',
                        marginBottom: '20px',
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-6 order-md-2 mt-5">
                    <h2>高度的舒適設計</h2>
                    <p>{desc}</p>
                  </div>
                  <div className="col-md-6 order-md-1">
                    <img
                      className="w-75"
                      src={`/product-img/${v}`}
                      alt=""
                      style={{ borderRadius: '50px 50px 50px 0px' }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  )
}
