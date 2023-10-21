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
import { ConnectButton } from "@/components/shared/connect-button"

export default function HomePage() {

  return (
    <div className="container relative mt-20 px-0">
      <PageHeader className="pb-8">
        <PageHeaderHeading>BEST DAPP EVER</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
          <ConnectButton>
            Connect with Amicus
          </ConnectButton>
      </PageHeader>
    </div>
  )
}
