import React from 'react'
import Link from 'next/link'

export default function SideBar({ proTect, setProTect, updateProductData }) {
  const handleRadioChange = (e) => {
    setProTect(e.target.value) //因為 setProTect會比updateProductData()來得慢，不如在
    updateProductData(e.target.value)
  }
  // console.log('setProTect:', setProTect)

  return (
    <>
      <ul className="list-group">
        <li className="list-group-item">類別</li>

        <li className="list-group-item">
          <Link href="../product/productTraningList">居家訓練</Link>
        </li>

        <li className="list-group-item">
          <Link href="../product/productClothList">健身服飾</Link>
        </li>
        <li className="list-group-item">
          <Link href="../product/productFoodList">健康食品</Link>
        </li>
      </ul>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <Link href="../product/productProtectList">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                健身護具
              </button>
            </Link>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div>
                <label>
                  <input
                    type="radio"
                    name="protect"
                    value="waist"
                    checked={proTect === 'waist'}
                    onChange={handleRadioChange}
                  />
                  護腰
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="protect"
                    value="knee"
                    checked={proTect === 'knee'}
                    onChange={handleRadioChange}
                  />
                  護膝
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="protect"
                    value="leg"
                    checked={proTect === 'leg'}
                    onChange={handleRadioChange}
                  />
                  護腿
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="protect"
                    value="ankle"
                    checked={proTect === 'ankle'}
                    onChange={handleRadioChange}
                  />
                  護踝
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
