import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { ProfileCreated } from "../generated/AmicusProfileFactory/AmicusProfileFactory"

export function createProfileCreatedEvent(
  profile: Address,
  owner: Address
): ProfileCreated {
  let profileCreatedEvent = changetype<ProfileCreated>(newMockEvent())

  profileCreatedEvent.parameters = new Array()

  profileCreatedEvent.parameters.push(
    new ethereum.EventParam("profile", ethereum.Value.fromAddress(profile))
  )
  profileCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return profileCreatedEvent
}
