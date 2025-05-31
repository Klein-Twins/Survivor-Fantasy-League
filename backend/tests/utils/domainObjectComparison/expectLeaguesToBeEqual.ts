import { UUID } from 'crypto';
import { League } from '../../../src/domain/league/League';
import { LeagueMember } from '../../../src/domain/league/LeagueMember';
import { LeagueInvite } from '../../../src/domain/league/invite/LeagueInvite';

export function expectLeaguesToBeEqual(league1: League, league2: League) {
  expect(league1.getId()).toEqual(league2.getId());
  expect(league1.getSeasonId()).toEqual(league2.getSeasonId());
  expect(league1.getName()).toEqual(league2.getName());
  expectLeagueMembersArrayToBeEqual(
    league1.getLeagueMembers(),
    league2.getLeagueMembers()
  );
  expectLeagueMembersToBeEqual(
    league1.getLeagueOwner(),
    league2.getLeagueOwner()
  );
  expectLeagueInvitesMapToBeEqual(
    league1.getLeagueInvites(),
    league2.getLeagueInvites()
  );
  expect(league1.toDTO()).toEqual(league2.toDTO());
}

export function expectLeagueInvitesMapToBeEqual(
  league1LeagueInvites: Map<UUID, LeagueInvite>,
  league2LeagueInvites: Map<UUID, LeagueInvite>
) {
  expect(league1LeagueInvites.size).toEqual(league2LeagueInvites.size);
  league1LeagueInvites.forEach((invite1, inviteId) => {
    const invite2 = league2LeagueInvites.get(inviteId);
    expect(invite2).toBeDefined();
    expectLeagueInvitesToBeEqual(invite1, invite2!);
  });
}

function expectLeagueInvitesToBeEqual(
  leagueInvite1: LeagueInvite,
  leagueInvite2: LeagueInvite
) {
  expectAccountsToBeEqual(
    leagueInvite1.getInvitedAccount(),
    leagueInvite2.getInvitedAccount()
  );
  //compare league.getInviters()
  const league1Inviters = leagueInvite1.getInviters();
  const league2Inviters = leagueInvite2.getInviters();
  expectLeagueInviteInvitersToBeEqual(league1Inviters, league2Inviters);
  expect(leagueInvite1.getInviteStatus()).toEqual(
    leagueInvite2.getInviteStatus()
  );
  expect(leagueInvite1.toDTO()).toEqual(leagueInvite2.toDTO());
}

function expectLeagueInviteInvitersToBeEqual(
  leagueInvite1Inviters: {
    inviteId: UUID;
    inviterLeagueMember: LeagueMember;
  }[],
  leagueInvite2Inviters: {
    inviteId: UUID;
    inviterLeagueMember: LeagueMember;
  }[]
) {
  expect(leagueInvite1Inviters.length).toEqual(leagueInvite2Inviters.length);
  leagueInvite1Inviters.forEach((inviter1, index) => {
    const inviter2 = leagueInvite2Inviters[index];
    expect(inviter1.inviteId).toEqual(inviter2.inviteId);
    expectLeagueMembersToBeEqual(
      inviter1.inviterLeagueMember,
      inviter2.inviterLeagueMember
    );
  });
}

function expectLeagueMembersArrayToBeEqual(
  league1LeagueMembers: LeagueMember[],
  league2LeagueMembers: LeagueMember[]
) {
  expect(league1LeagueMembers.length).toEqual(league2LeagueMembers.length);
  league1LeagueMembers.forEach((member1, index) => {
    const member2 = league2LeagueMembers[index];
    expectLeagueMembersToBeEqual(member1, member2);
  });
}

function expectLeagueMembersToBeEqual(
  leagueMember1: LeagueMember,
  leagueMember2: LeagueMember
) {
  expect(leagueMember1.getId()).toEqual(leagueMember2.getId());
  expect(leagueMember1.getRole()).toEqual(leagueMember2.getRole());
  expectAccountsToBeEqual(
    leagueMember1.getAccount(),
    leagueMember2.getAccount()
  );
  expect(leagueMember1.toDTO()).toEqual(leagueMember2.toDTO());
}

export function expectAccountsToBeEqual(
  account1: LeagueMember['account'],
  account2: LeagueMember['account']
) {
  expect(account1.getAccountId()).toEqual(account2.getAccountId());
  expect(account1.getEmail()).toEqual(account2.getEmail());
  expect(account1.getAccountRole()).toEqual(account2.getAccountRole());
  expect(account1.getProfileId()).toEqual(account2.getProfileId());
  expect(account1.getFirstName()).toEqual(account2.getFirstName());
  expect(account1.getLastName()).toEqual(account2.getLastName());
  expect(account1.getUserName()).toEqual(account2.getUserName());
  expect(account1.getFullName()).toEqual(account2.getFullName());
  //TODO: Validate userSessions to be equal
  //TODO: Validate activePasword to be equal
}
