import React from 'react'
import Link from 'next/link'
import ArticleCard from '@/components/articles/article-card'
import LessonCard from '@/components/lessons/lessonCard'
import CoachCard from '@/components/coaches/coachCard'
import CardList from '@/components/product/card-list/card-list'
import CardDetail from '@/components/product/card-detail/card-detail'
import GymCardSpot from '@/components/gyms/gymCard-spot'

export default function useRenderCards(cardType = 'articles') {
  const renderArticleCard = (item) => {
    return (
      <ArticleCard
        title={item.article_title}
        category={item.code_desc}
        update_at={item.update_at}
        imgSrc={item.article_cover}
        idURL={item.article_id}
        member_id={item.member_id_fk}
      />
    )
  }

  const renderCoachCard = (item) => {
    return (
      <Link href={`/coaches/${item.coach_id}`}>
        <CoachCard
          name={item.coach_name}
          skill={item.skills}
          imgSrc={`/${item.coach_img}`}
        />
      </Link>
    )
  }

  const renderLessonCard = (item) => {
    return (
      <Link href={`/lessons/${item.lesson_id}`}>
        <LessonCard
          title={item.lesson_name}
          price={`NT$ ${item.lesson_price}`}
          category={item.categories}
          gym={item.gym_name}
          imgSrc={`/${item.lesson_img}`}
        />
      </Link>
    )
  }

  const renderProductCard = (item) => {
    return (
      <CardList
        id={item.Product_id}
        name={item.Product_name}
        price={item.Product_price}
      // imgSrc={item.article_cover}
      />
    )
  }

  const renderProductDetailCard = (item) => {
    return (
      <CardDetail
      // id={item.Product_id}
      // name={item.Product_name}
      // price={item.Product_price}
      // imgSrc={item.article_cover}
      />
    )
  }

  const renderGymCardSpot = (item) => {
    return <GymCardSpot data={item} />
  }

  const renderCard = (item) => {
    switch (cardType) {
      case 'articles':
        return renderArticleCard(item)
      case 'lessons':
        return renderLessonCard(item)
      case 'coaches':
        return renderCoachCard(item)
      case 'products':
        return renderProductCard(item)
      case 'product-detail':
        return renderProductDetailCard(item)
      case 'gym-spot':
        return renderGymCardSpot(item)
      default:
        console.log(
          `沒有這個卡片喔: ${cardType} 目前有的卡片種類: articles / lessons / coaches / products / product-detail / gym-spot`
        )
        return null
    }
  }

  return renderCard
}
