export default function useToggleDisplay(
  group = 1,
  setGroup = () => {},
  visibleData = [],
  setVisibleData = () => {},
  setRemain = () => {},
  totalGroup = 1,
  totalRows = 1,
  perGroup = 3,
  actionOnToggle = () => {}
) {
  const toggleOnClick = (e) => {
    // TODO: try achieve no fetch everytime show prev fetched result
    let sliceIndex = perGroup

    if (e.currentTarget.id === 'showLess') {
      const nextVisibleData = visibleData.slice(0, sliceIndex)
      setVisibleData(nextVisibleData)
      const nextGroup = 1
      setGroup(nextGroup)
      const nextRemain = parseInt(totalRows) - nextGroup * perGroup
      setRemain(nextRemain)
    } else if (e.currentTarget.id === 'showMore') {
      actionOnToggle()
    }
  }
  return toggleOnClick
}
