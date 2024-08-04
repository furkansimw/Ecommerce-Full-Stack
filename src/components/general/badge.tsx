import React from "react";
import { IconAlert, IconInfo, IconSuccess, IconWarm } from "../icons/icons";
import { IStatus } from "@/hooks/status";

type BadgeType = "info" | "alert" | "warm" | "success";

const badgeStyles = {
  info: {
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    Icon: IconInfo,
  },
  alert: {
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    Icon: IconAlert,
  },
  warm: {
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    Icon: IconWarm,
  },
  success: {
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    Icon: IconSuccess,
  },
};

export function Badge({ type, text }: { type: BadgeType; text: string }) {
  const { bgColor, textColor, Icon } = badgeStyles[type];

  return (
    <div className={`${bgColor} flex items-center p-4 rounded-md`}>
      <Icon />
      <p className={`ml-4 ${textColor} text-sm`}>{text}</p>
    </div>
  );
}

export function StatusCard({
  status: { loading, error, data },
}: {
  status: IStatus;
}) {
  if (loading) return <Loading />;
  if (error) return <Badge type="alert" text={error} />;
  if (data) return <Badge type="success" text={data} />;

  return <></>;
}

export function Loading() {
  return (
    <div className="h-[52px] w-[52px] mx-auto">
      <img className="w-9 h-9" src="/loading.gif" alt="gif" />
    </div>
  );
}
