import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, withState } from "recompose";
import { map, findIndex, get, concat } from "lodash";
import classNames from "classnames";
import { Glyphicon } from "react-bootstrap";
import { Layout, Menu, Dropdown, Icon } from "antd";

import Button from "./Button";
import { changeLanguage } from "../actions/appActions";
import { signOut } from "../actions/userActions";
import { hasValue } from "../utils";
import { languagesLabels } from "../enums";

const { Header } = Layout;

const ButtonLanguage = ({ language, changeLanguage, className }) => (
  <Button
    {...{
      size: "large",
      ghost: true,
      className: `button-language${className ? ` ${className}` : ""}`,
      onClick: () => changeLanguage()
    }}
  >
    {languagesLabels[language]}
  </Button>
);

const AppHeader = ({
  match,
  history,
  authStyle,
  noRoleStyle,
  menuItems,
  showVerticalMenu,
  setShowVerticalMenu,
  signOut,
  language,
  changeLanguage,
  texts,
  collapsed,
  setCollapsed
}) => {
  const isIE = navigator.appVersion.toString().indexOf(".NET") > 0;

  const dropdownMenuItems = [
    { url: "/", label: texts.SIGN_OUT, onClick: () => signOut() }
  ];

  const allItems = concat(
    noRoleStyle ? [] : menuItems,
    {
      label: languagesLabels[language],
      onClick: () => changeLanguage(),
      className: "item-language"
    },
    dropdownMenuItems
  );

  return (
    <Header
      {...{
        className: classNames("app-header", {
          center: authStyle,
          normal: !authStyle,
          ie: isIE,
          "with-menu": showVerticalMenu
        })
      }}
    >
      {!authStyle ? (
        <div {...{ className: "content" }}>
          <div
            {...{
              className: classNames("top", {
                "with-menu": showVerticalMenu,
                "with-menu-button": collapsed || noRoleStyle
              })
            }}
          >
            {collapsed && (
              <Button
                {...{
                  size: "large",
                  ghost: true,
                  className: "menu-button",
                  onClick: () => setCollapsed(false)
                }}
              >
                <Glyphicon {...{ glyph: "menu-hamburger" }} />
              </Button>
            )}
            <h2
              {...{
                className: classNames("title", {
                  "title-hidden": !collapsed && !noRoleStyle
                })
              }}
            >
              ARCLib
            </h2>
            <div {...{ className: "right" }}>
              <ButtonLanguage
                {...{
                  language,
                  changeLanguage,
                  className: "margin-right-small"
                }}
              />
              <div {...{ className: "dropdown dropdown-user" }}>
                <Dropdown
                  {...{
                    overlay: (
                      <Menu
                        {...{
                          theme: "dark",
                          onClick: e => {
                            if (
                              get(dropdownMenuItems[Number(e.key)], "onClick")
                            ) {
                              dropdownMenuItems[Number(e.key)].onClick();
                            }

                            if (get(dropdownMenuItems[Number(e.key)], "url")) {
                              history.push(
                                dropdownMenuItems[Number(e.key)].url
                              );
                            }
                          }
                        }}
                      >
                        {map(dropdownMenuItems, (menuItem, i) => (
                          <Menu.Item
                            {...{
                              key: i
                            }}
                          >
                            {menuItem.label}
                          </Menu.Item>
                        ))}
                      </Menu>
                    ),
                    placement: "bottomRight",
                    trigger: ["click"]
                  }}
                >
                  <Button {...{ size: "large", ghost: true }}>
                    <Icon {...{ type: "user" }} />
                  </Button>
                </Dropdown>
              </div>
              <Button
                {...{
                  size: "large",
                  ghost: true,
                  className: "menu-all-button",
                  onClick: () => setShowVerticalMenu(!showVerticalMenu)
                }}
              >
                <Glyphicon {...{ glyph: "menu-hamburger" }} />
              </Button>
            </div>
          </div>
          <div {...{ className: "bottom" }}>
            {showVerticalMenu && (
              <Menu
                {...{
                  theme: "dark",
                  onClick: e => {
                    if (get(allItems[Number(e.key)], "onClick")) {
                      allItems[Number(e.key)].onClick();
                    }

                    if (get(allItems[Number(e.key)], "url")) {
                      history.push(allItems[Number(e.key)].url);
                    }
                  },
                  className: "menu-all",
                  selectedKeys: hasValue(
                    findIndex(allItems, menuItem => match.url === menuItem.url)
                  )
                    ? [
                        `${findIndex(
                          allItems,
                          menuItem => match.url === menuItem.url
                        )}`
                      ]
                    : undefined
                }}
              >
                {map(allItems, (menuItem, i) => (
                  <Menu.Item
                    {...{
                      key: i,
                      className: menuItem.className
                    }}
                  >
                    {menuItem.label}
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </div>
        </div>
      ) : (
        <div {...{ className: "content" }}>
          <h2 {...{ className: "title" }}>ARCLib</h2>
          <ButtonLanguage
            {...{
              language,
              changeLanguage
            }}
          />
        </div>
      )}
    </Header>
  );
};

export default compose(
  withRouter,
  connect(({ app: { user, language, texts } }) => ({ user, language, texts }), {
    signOut,
    changeLanguage
  }),
  withState("showVerticalMenu", "setShowVerticalMenu", false)
)(AppHeader);
