import { SbBlokData } from "@storyblok/js";
import { LinkModel } from "../../models/link.model";
import { FunctionComponent } from "react";
import { BlokComponentModel } from "../../models/blok-component.model";
import { Menu } from "@headlessui/react";

interface MenuLinkProps extends SbBlokData {
    label: string;
    link: LinkModel;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const MenuLink: FunctionComponent<BlokComponentModel<MenuLinkProps>> = ({blok}) => {
    return <Menu.Item>
        { ( { active } ) => (
            <a
                href={`/${blok.link.cached_url}`}
                className={ classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                ) }
            >
                {blok.label}
            </a>
        ) }
    </Menu.Item>
}

export default MenuLink;