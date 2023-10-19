import { ProfileCreated as ProfileCreatedEvent } from "../generated/AmicusProfileFactory/AmicusProfileFactory";
import {
  AmicusProfile as AmicusProfileEntity,
  ProfileCreated,
} from "../generated/schema";
import { AmicusProfile as AmicusProfileContract } from "../generated/templates/AmicusProfile/AmicusProfile";

export function handleProfileCreated(event: ProfileCreatedEvent): void {
  let entity = new ProfileCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.profile = event.params.profile;
  entity.owner = event.params.owner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let profile = AmicusProfileEntity.load(event.params.profile);
  if (profile != null) return;

  let profileContract = AmicusProfileContract.bind(event.params.profile);

  profile = new AmicusProfileEntity(event.params.profile);
  profile.name = profileContract.name();
  profile.image = profileContract.image();

  profile.save();
}
