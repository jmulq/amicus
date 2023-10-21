import Image from "next/image"
import Link from "next/link"
import { LuBook } from "react-icons/lu"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderCTA,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"

export default function HomePage() {
  return (
    <div className="container relative mt-20 px-0">
      <PageHeader className="pb-8">
        <Image
          src="/logo-gradient.png"
          alt="TurboETH Logo"
          width={80}
          height={80}
          className="h-20 w-20 rounded-2xl"
        />
        <PageHeaderHeading>BEST DAPP EVER</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
        <PageHeaderCTA>
          <Link
            href={siteConfig.links.docs}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonVariants({ variant: "default" })}
          >
            <LuBook className="mr-2 h-4 w-4" />
            Connect
          </Link>
        </PageHeaderCTA>
      </PageHeader>
    </div>
  )
}
