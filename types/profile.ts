import { JSX } from "react";

export type ProfileItemProps = {
    icon: (props: { size?: number; color?: string }) => JSX.Element;
    label: string;
    value: string;
    onPress: () => void;
};

export type MenuButtonProps = {
    icon: (props: { size?: number; color?: string }) => JSX.Element;
    title: string;
    subtitle?: string;
    onPress: () => void;
    iconBgColor?: string;
    iconColor?: string;
};
