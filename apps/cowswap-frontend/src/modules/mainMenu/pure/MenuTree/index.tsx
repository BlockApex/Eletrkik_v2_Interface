import IMAGE_MOON from '@cowprotocol/assets/cow-swap/moon.svg'
import IMAGE_SUN from '@cowprotocol/assets/cow-swap/sun.svg'
import { ExternalLink as ExternalLinkComponent } from '@cowprotocol/ui'

import SVG from 'react-inlinesvg'

import { HeaderLinks as Wrapper, StyledNavLink } from 'legacy/components/Header/styled'
import MenuDropdown from 'legacy/components/MenuDropdown'
import { MenuSection, MenuTitle } from 'legacy/components/MenuDropdown/styled'

import {
  CustomItem,
  DropDownItem,
  ExternalLink,
  InternalLink,
  MainMenuContext,
  MenuItemKind,
  MenuLink,
  MenuTreeItem,
  ParametrizedLink,
} from 'modules/mainMenu/types'
import { parameterizeTradeRoute } from 'modules/trade/utils/parameterizeTradeRoute'

import { RoutesValues } from 'common/constants/routes'

import { MAIN_MENU } from '../../constants/mainMenu'

// Assets

// TODO: decompose the file

interface MenuImageProps {
  title: string
  iconSVG?: string
  icon?: string
}

function MenuImage(props: MenuImageProps) {
  const { title, iconSVG, icon } = props

  if (iconSVG) {
    return <SVG src={iconSVG} description={`${title} icon`} />
  } else if (icon) {
    return <img src={icon} alt={`${title} icon`} />
  } else {
    return null
  }
}

interface InternalExternalLinkProps {
  link: InternalLink | ExternalLink | ParametrizedLink | CustomItem
  context: MainMenuContext
}

function Link({ link, context }: InternalExternalLinkProps) {
  if (link.kind === MenuItemKind.CUSTOM_ITEM) {
    const { Item: LinkComponent } = link
    return <>{LinkComponent()}</>
  }

  const { kind, title, url, iconSVG, icon } = link
  const menuImage = <MenuImage title={title} icon={icon} iconSVG={iconSVG} />
  const isExternal = kind === MenuItemKind.EXTERNAL_LINK
  const isDynamic = kind === MenuItemKind.PARAMETRIZED_LINK
  const { handleMobileMenuOnClick, tradeContext } = context
  const internalUrl = isDynamic ? parameterizeTradeRoute(tradeContext, url as RoutesValues) : url

  if (isExternal) {
    return (
      <ExternalLinkComponent href={url} onClickOptional={handleMobileMenuOnClick}>
        {menuImage}
        {title}
      </ExternalLinkComponent>
    )
  }

  return (
    <StyledNavLink to={internalUrl} end onClick={handleMobileMenuOnClick}>
      {menuImage}
      {title}
    </StyledNavLink>
  )
}

type DarkModeButtonProps = {
  context: MainMenuContext
}

function DarkModeButton({ context }: DarkModeButtonProps) {
  const { darkMode, toggleDarkMode, handleMobileMenuOnClick } = context
  const description = `${darkMode ? 'Sun/light' : 'Moon/dark'} mode icon`
  const label = (darkMode ? 'Light' : 'Dark') + ' Mode'
  return (
    <button
      onClick={() => {
        handleMobileMenuOnClick()
        toggleDarkMode()
      }}
    >
      <SVG src={darkMode ? IMAGE_SUN : IMAGE_MOON} description={description} /> {label}
    </button>
  )
}

interface LinkProps {
  link: MenuLink
  context: MainMenuContext
}

function DropdownLink({ link, context }: LinkProps) {
  switch (link.kind) {
    case MenuItemKind.DARK_MODE_BUTTON:
      return <DarkModeButton context={context} />

    default:
      return <Link link={link} context={context} />
  }
}

interface DropdownProps {
  item: DropDownItem
  context: MainMenuContext
}

const DropDown = ({ item, context }: DropdownProps) => {
  const { title, items } = item

  return (
    <MenuDropdown title={title}>
      {items?.map((item, index) => {
        const { sectionTitle, links } = item
        return (
          <MenuSection key={index}>
            {sectionTitle && <MenuTitle>{sectionTitle}</MenuTitle>}
            {links.map((link, linkIndex) => (
              <DropdownLink key={linkIndex} link={link} context={context} />
            ))}
          </MenuSection>
        )
      })}
    </MenuDropdown>
  )
}

interface MenuItemWithDropDownProps {
  menuItem: MenuTreeItem
  context: MainMenuContext
}

function MenuItemWithDropDown(props: MenuItemWithDropDownProps) {
  const { menuItem, context } = props

  switch (menuItem.kind) {
    case MenuItemKind.DROP_DOWN:
      return <DropDown item={menuItem} context={context} />

    case undefined: // INTERNAL
    case MenuItemKind.PARAMETRIZED_LINK:
    case MenuItemKind.EXTERNAL_LINK:
      // Render Internal/External links
      return <Link link={menuItem} context={context} />
    case MenuItemKind.CUSTOM_ITEM:
      return <>{menuItem.Item}</>
    default:
      return null
  }
}

export interface MenuTreeProps {
  items?: MenuTreeItem[]
  context: MainMenuContext
  isMobileMenuOpen: boolean
}

export function MenuTree({ items = MAIN_MENU, isMobileMenuOpen, context }: MenuTreeProps) {
  return (
    <Wrapper isMobileMenuOpen={isMobileMenuOpen}>
      {items.map((menuItem, index) => {
        return <MenuItemWithDropDown key={index} menuItem={menuItem} context={context} />
      })}
    </Wrapper>
  )
}
