import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileLinkProps {
  imgUrl: string;
  title?: string;
  href?: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center text-dark200_light800 gap-1">
      <Image src={imgUrl} alt="Profile picture" width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-accent-blue">
          {title}
        </Link>
      ) : (
        <p>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
