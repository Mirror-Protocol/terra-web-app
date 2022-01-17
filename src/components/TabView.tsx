import React, { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import Card from "./Card"
import { TooltipIcon } from "./Tooltip"
import styles from "./TabView.module.scss"
import Modal from "./Modal"

const TabView: FC<TabViewProps> = ({
  tabs,
  selectedTabName,
  shadow,
  extra,
  children,
  side,
}) => {
  const { search, state } = useLocation()

  return !selectedTabName ? null : (
    <div className={styles.wrapper}>
      <Card full shadow={shadow}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            {tabs.map((tab) => {
              const to = { hash: tab.name, search, state }
              const tooltip = tab.tooltip
              const label = tooltip ? (
                <TooltipIcon content={tooltip}>
                  {tab.title || tab.name}
                </TooltipIcon>
              ) : (
                tab.title || tab.name
              )

              return (
                <Link
                  replace
                  to={to}
                  className={classNames(
                    ...[
                      styles.tabs__item,
                      tab.name === selectedTabName && styles.active,
                    ]
                  )}
                  key={tab.name}
                >
                  <span className={styles.tabs__item__sizer}>{label}</span>
                  <span className={styles.tabs__item__label}>{label}</span>
                </Link>
              )
            })}
          </div>
          {extra?.length && (
            <div className={styles.extra}>
              {extra.map(({ iconUrl, onClick, disabled }) => (
                <button
                  key={iconUrl}
                  className={styles.extra__item}
                  type="button"
                  style={{ backgroundImage: `url('${iconUrl}')` }}
                  onClick={onClick}
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </div>

        <section className={styles.content}>{children}</section>
      </Card>
      {side && (
        <div
          className={classNames(
            ...[
              styles.side,
              !side.filter(({ visible }) => visible).length &&
                styles["side--invisible"],
            ]
          )}
        >
          {side?.map((item, index) => (
            <React.Fragment key={index}>
              <div
                className={classNames(
                  ...[
                    styles.side__view,
                    !item.visible && styles["side__view--invisible"],
                    item.isModalOnMobile &&
                      styles["side__view--hide-on-mobile"],
                  ]
                )}
              >
                <Card shadow={shadow}>{item.visible && item.component}</Card>
              </div>
              {item.isModalOnMobile && (
                <Modal
                  className={styles["side__view--hide-on-desktop"]}
                  isOpen={item.visible}
                  isCloseBtn={false}
                  open={() => item.onOpen && item.onOpen()}
                  close={() => item.onClose && item.onClose()}
                  url={""}
                  name={""}
                >
                  <Card shadow={shadow}>{item.visible && item.component}</Card>
                </Modal>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabView
