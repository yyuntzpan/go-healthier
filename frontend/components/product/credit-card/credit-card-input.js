import React from 'react'
import styles from './credit-card-input.module.css'
import CreditCardCtn from '../button/credit-card-btn'

export default function CreditCardInput() {
  return (
    <>
      {/* <div className="col-12 col-md-6 mt-5 h6 text-center">
        選擇付款方式
        <div>
          <select
            id=""
            name=""
            className={styles.customSelect}
            aria-label="Default select example"
            style={{
              width: '70%',
              height: '50px',
              borderRadius: '50px',
              marginTop: '30px',
              marginBottom: '20px',
              marginLeft: '30px',
            }}
          >
            <option className="text-center">請選擇</option>
            <option value="" className="text-center">
              信用卡/金融卡{' '}
            </option>
            <option value="" className="text-center">
              line Pay
            </option>
            <option value="" className="text-center">
              貨到付款
            </option>
            <option value="" className="text-center"></option>
          </select>
        </div>
        <CreditCardCtn />
      </div> */}
    </>
  )
}
