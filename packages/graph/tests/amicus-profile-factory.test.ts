import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { Address } from "@graphprotocol/graph-ts"
import { ProfileCreated } from "../generated/schema"
import { ProfileCreated as ProfileCreatedEvent } from "../generated/AmicusProfileFactory/AmicusProfileFactory"
import { handleProfileCreated } from "../src/amicus-profile-factory"
import { createProfileCreatedEvent } from "./amicus-profile-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let profile = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let newProfileCreatedEvent = createProfileCreatedEvent(profile, owner)
    handleProfileCreated(newProfileCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ProfileCreated created and stored", () => {
    assert.entityCount("ProfileCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ProfileCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "profile",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ProfileCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
