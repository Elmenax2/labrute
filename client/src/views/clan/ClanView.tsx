import { BruteRanking, ClanGetResponse, bosses, getFightsLeft } from '@labrute/core';
import { Brute, InventoryItemType } from '@labrute/prisma';
import { HighlightOff, PlayCircleOutline } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import BruteRender from '../../components/Brute/Body/BruteRender';
import FantasyButton from '../../components/FantasyButton';
import Link from '../../components/Link';
import Page from '../../components/Page';
import StyledButton from '../../components/StyledButton';
import Text from '../../components/Text';
import { useAlert } from '../../hooks/useAlert';
import { useAuth } from '../../hooks/useAuth';
import { useBrute } from '../../hooks/useBrute';
import { useConfirm } from '../../hooks/useConfirm';
import Server from '../../utils/Server';
import catchError from '../../utils/catchError';

enum SortOption { Default = 'default', Level = 'level', Rank = 'ranking', Victories = 'victories', Damage = 'damage'}

const ClanView = () => {
  const { t } = useTranslation();
  const { bruteName, id } = useParams();
  const Alert = useAlert();
  const { user, updateData } = useAuth();
  const navigate = useNavigate();
  const Confirm = useConfirm();
  const { updateBrute } = useBrute();
  const [clan, setClan] = useState<ClanGetResponse | null>(null);
  const [damageDisplayed, setDamageDisplayed] = useState(false);
  const [sort, setSort] = useState<SortOption>(SortOption.Default);
  const brute = useMemo(
    () => (user ? user.brutes.find((b) => b.name === bruteName) : null),
    [bruteName, user],
  );

  const boss = useMemo(() => clan && bosses.find((b) => b.name === clan.boss), [clan]);

  // Fetch clan
  useEffect(() => {
    if (!id) return;

    Server.Clan.get(id).then((data) => {
      setClan(data);
    }).catch(catchError(Alert));
  }, [id, Alert]);

  // Go to cell page
  const goToCell = (name: string) => () => {
    navigate(`/${name}/cell`);
  };

  useEffect(() => {
    setClan((prevClan) => {
      if (!prevClan) return prevClan;
      const clanBrutes = prevClan.brutes.sort((a : Brute, b : Brute) => {
        switch (sort) {
          case SortOption.Default:
            if (a.masterId) return -1;
            if (a.ranking === b.ranking) {
              return (b.level - a.level);
            }
            return a.ranking - b.ranking;
          case SortOption.Rank:
            return a.ranking - b.ranking;
          case SortOption.Victories:
            return a.victories - b.victories;
          case SortOption.Level:
            return a.level - b.level;
          case SortOption.Damage:
          { const damageA = prevClan.bossDamages.find(
            (damageBrute) => damageBrute.brute.id === a.id
          )?.damage ?? 0;
          const damageB = prevClan.bossDamages.find(
            (damageBrute) => damageBrute.brute.id === b.id
          )?.damage ?? 0;
          return damageA - damageB; }
          default:
            return 0;
        }
      });
      return {
        ...prevClan,
        brutes: clanBrutes
      };
    });
  }, [sort]);

  // Ask to join clan
  const askToJoin = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!brute || !clan) return;

    Confirm.open(t('joinAClan'), t('confirmJoin'), () => {
      Server.Clan.request(brute.name, clan.id).then(() => {
        Alert.open('success', t('requestSent'));

        // Update clan
        setClan((prevClan) => (prevClan ? ({
          ...prevClan,
          joinRequests: [...prevClan.joinRequests, brute],
        }) : null));
      }).catch(catchError(Alert));
    });
  };

  // Cancel join request
  const cancelRequest = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!brute || !clan) return;

    Confirm.open(t('cancelJoinRequest'), t('confirmCancelRequest'), () => {
      Server.Clan.cancelRequest(brute.name, clan.id).then(() => {
        Alert.open('success', t('requestCanceled'));

        // Update clan
        setClan((prevClan) => (prevClan ? ({
          ...prevClan,
          joinRequests: prevClan.joinRequests.filter((br) => br.id !== brute?.id),
        }) : null));
      }).catch(catchError(Alert));
    });
  };

  // Accept join request
  const acceptJoin = (requester: Brute) => () => {
    if (!user || !clan) return;

    Confirm.open(t('acceptJoinRequest'), t('confirmAcceptRequest'), () => {
      Server.Clan.accept(requester.name, clan.id).then(() => {
        Alert.open('success', t('requestAccepted'));

        // Update clan
        setClan((prevClan) => (prevClan ? ({
          ...prevClan,
          joinRequests: prevClan.joinRequests.filter((br) => br.id !== requester.id),
          brutes: [...prevClan.brutes, requester],
        }) : null));

        // Update user data if it's an own brute
        if (user.brutes.find((b) => b.id === requester.id)) {
          updateData((data) => (data ? ({
            ...data,
            brutes: data.brutes.map((b) => (b.name === requester.name ? {
              ...b, clanId: clan.id,
            } : b)),
          }) : null));
        }
      }).catch(catchError(Alert));
    });
  };

  // Reject join request
  const rejectJoin = (requester: Brute) => () => {
    if (!clan) return;

    Confirm.open(t('rejectJoinRequest'), t('confirmRejectRequest'), () => {
      Server.Clan.reject(requester.name, clan.id).then(() => {
        Alert.open('success', t('requestRejected'));

        // Update clan
        setClan((prevClan) => (prevClan ? ({
          ...prevClan,
          joinRequests: prevClan.joinRequests.filter((br) => br.id !== requester.id),
        }) : null));
      }).catch(catchError(Alert));
    });
  };

  // Remove brute from clan
  const removeFromClan = (clanBrute: Brute) => (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!clan) return;

    Confirm.open(t('removeFromClan'), t('confirmRemoveFromClan'), () => {
      Server.Clan.remove(clanBrute.name, clan.id).then(() => {
        Alert.open('success', t('bruteRemoved'));

        // Update clan
        setClan((prevClan) => (prevClan ? ({
          ...prevClan,
          brutes: prevClan.brutes.filter((br) => br.id !== clanBrute.id),
        }) : null));
      }).catch(catchError(Alert));
    });
  };

  // Set as clan master
  const setMaster = (clanBrute: Brute) => (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!clan) return;

    Confirm.open(t('setNewMaster'), t('confirmSetNewMaster'), () => {
      Server.Clan.setMaster(clanBrute.name, clan.id).then(() => {
        Alert.open('success', t('clanMasterChanged'));

        // Update clan
        setClan((prevClan) => {
          if (!prevClan) return null;

          // Set new master as first in the list
          const newBrutes = prevClan.brutes.filter((br) => br.id !== clanBrute.id);
          newBrutes.unshift(clanBrute);

          return {
            ...prevClan,
            masterId: clanBrute.id,
            brutes: newBrutes,
          };
        });
      }).catch(catchError(Alert));
    });
  };

  // Leave clan
  const leave = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!clan || !brute) return;

    Confirm.open(t('leaveClan'), t('confirmLeaveClan'), () => {
      Server.Clan.leave(brute.name, clan.id).then(() => {
        Alert.open('success', t('clanLeft'));

        // Update clan
        setClan((prevClan) => (prevClan ? ({
          ...prevClan,
          brutes: prevClan.brutes.filter((br) => br.id !== brute?.id),
        }) : null));

        // Update user data
        updateData((data) => (data ? ({
          ...data,
          brutes: data.brutes.map((b) => (b.name === brute.name ? {
            ...b, clanId: null,
          } : b)),
        }) : null));

        updateBrute((b) => (b ? { ...b, clanId: null, clan: null } : null));

        // Redirect to cell
        navigate(`/${brute.name}/cell`);
      }).catch(catchError(Alert));
    });
  };

  // Challenge boss
  const challengeBoss = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!clan || !brute) return;

    // Check if brute still has fights left
    if (getFightsLeft(brute) <= 0) {
      Alert.open('error', t('noFightsLeft'));
      return;
    }

    Server.Clan.challengeBoss(brute.name, clan.id).then((fight) => {
      // Update fights left
      updateData((data) => (data ? ({
        ...data,
        brutes: data.brutes.map((b) => (b.name === brute.name ? {
          ...b,
          fightsLeft: getFightsLeft(b) - 1,
          lastFight: new Date(),
        } : b)),
      }) : null));

      updateBrute((b) => {
        if (!b) return null;

        // Add 1x BossTicket to inventory
        const bossTicket = b.inventory.find((i) => i.type === InventoryItemType.bossTicket);
        if (bossTicket) {
          bossTicket.count += 1;
        } else {
          b.inventory.push({
            type: InventoryItemType.bossTicket,
            count: 1,
          });
        }

        return {
          ...b,
          fightsLeft: getFightsLeft(b) - 1,
          lastFight: new Date(),
        };
      });

      // Boss gains
      if (fight.xp) {
        updateBrute((b) => (b ? {
          ...b,
          xp: b.xp + (fight.xp || 0),
        } : null));

        updateData((data) => (data ? ({
          ...data,
          gold: data.gold + (fight.gold || 0),
          brutes: data.brutes.map((b) => (b.clanId === clan.id ? {
            ...b,
            xp: b.xp + (fight.xp || 0),
          } : b)),
        }) : null));
      }

      navigate(`/${brute.name}/fight/${fight.id}`);
    }).catch(catchError(Alert));
  };

  return clan && (
    <Page title={`${bruteName || ''} ${t('MyBrute')}`} headerUrl={`/${bruteName || ''}/cell`}>
      <Paper sx={{ mx: 4 }}>
        <Text h3 bold upperCase typo="handwritten" sx={{ mr: 2 }}>{t('clan')} {clan.name}</Text>
      </Paper>
      <Paper sx={{ bgcolor: 'background.paperLight', mt: -2 }}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
        >
          <Link to={`/${bruteName || ''}/cell`}>
            <Text bold smallCaps>{t('goBackToYourCell')}</Text>
          </Link>
          <Link to={`/${bruteName || ''}/clan/ranking`}>
            <Text bold smallCaps>{t('ranking')}</Text>
          </Link>
          {user && brute?.clanId === clan.id && (
            <Link to={`/${bruteName || ''}/clan/${clan.id}/forum`}>
              <Text bold smallCaps>{t('forum')}</Text>
            </Link>
          )}
          {user
            && brute?.clanId !== clan.id
            && !clan.joinRequests.find((request) => request.id === brute?.id)
            && (
              <Link href="#" onClick={askToJoin}>
                <Text bold smallCaps>{t('askToJoin')}</Text>
              </Link>
            )}
          {user
            && brute?.clanId !== clan.id
            && clan.joinRequests.find((request) => request.id === brute?.id)
            && (
              <Link href="#" onClick={cancelRequest}>
                <Text bold smallCaps>{t('cancelJoinRequest')}</Text>
              </Link>
            )}
          {user && brute?.clanId === clan.id && (
            <Link href="#" onClick={leave}>
              <Text bold smallCaps>{t('leave')}</Text>
            </Link>
          )}
        </Box>
        {/* BOSS */}
        {boss && (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'inline-block' }}>
              <Text h4 bold color="secondary" center>{t('boss')}</Text>
              <Text bold h5 smallCaps color="primary.text">{clan.boss}</Text>
              {/* HP BAR */}
              <Tooltip title={`${boss.hp - clan.damageOnBoss} / ${boss.hp}`}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  bgcolor: 'secondary.main',
                  p: '2px',
                  mx: 'auto',
                  width: 120,
                }}
                >
                  <Box sx={{
                    bgcolor: 'level',
                    height: 3,
                    width: (boss.hp - clan.damageOnBoss) / boss.hp,
                  }}
                  />
                </Box>
              </Tooltip>
              {!!clan.damageOnBoss && (
                <>
                  <Text
                    smallCaps
                    subtitle2
                    center
                    onClick={() => setDamageDisplayed((prev) => !prev)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {damageDisplayed ? t('hideDamage') : t('showDamage')}
                  </Text>
                  {damageDisplayed && (
                    <Table sx={{
                      maxWidth: 1,
                      '& th': {
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        py: 0.5,
                        px: 1,
                        fontWeight: 'bold',
                        border: '1px solid',
                        borderColor: 'background.default',
                      },
                      '& td': {
                        bgcolor: 'background.paperDark',
                        py: 0.5,
                        px: 1,
                        border: '1px solid',
                        borderColor: 'background.default',
                      },
                    }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>{t('brute')}</TableCell>
                          <TableCell align="right">{t('damage')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clan.bossDamages.map((damages, index) => (
                          <TableRow key={damages.brute.id}>
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              {damages.brute.name}
                            </TableCell>
                            <TableCell align="right">{damages.damage}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </>
              )}
            </Box>
          </Box>
        )}
        {user && brute?.clanId === clan.id && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <FantasyButton color="warning" onClick={challengeBoss}>{t('challengeBoss')}</FantasyButton>
          </Box>
        )}
        {/* MEMBERS */}
        <Text bold h4 sx={{ my: 1 }}>{clan.brutes.length}/{clan.limit} {t('brutes')}</Text>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '15px',
          marginTop: '15px'
        }}
        >
          <ButtonGroup>
            {Object.values(SortOption).map((key) => <Button key={key} sx={{ color: sort === key ? 'orange' : 'black', backgroundColor: 'secondary.main', }} onClick={() => setSort(key)}>{t(key)}</Button>)}
          </ButtonGroup>
        </Box>

        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
        >
          {clan.brutes.map((clanBrute) => (
            <StyledButton
              key={clanBrute.name}
              image="/images/arena/brute-bg.webp"
              imageHover="/images/arena/brute-bg-hover.webp"
              contrast={false}
              shadow={false}
              onClick={goToCell(clanBrute.name)}
              sx={{
                width: 190,
                height: 102,
                mx: 1,
                my: 0.5,
              }}
            >
              <Box sx={{
                width: 185,
                height: 93,
                pl: 1,
                pt: 0.5,
                display: 'inline-block',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                >
                  <Box display="flex" alignItems="center">
                    {clan.masterId === clanBrute.id && (
                      <Box component="img" src="/images/clan/master.gif" sx={{ mr: 0.5, width: 7 }} />
                    )}
                    {/* Button to remove brute from clan */}
                    {clan.masterId === brute?.id && clan.masterId !== clanBrute.id && (
                      <Tooltip title={t('removeFromClan')}>
                        <HighlightOff
                          onClick={removeFromClan(clanBrute)}
                          fontSize="small"
                          color="error"
                          sx={{ mr: 0.5 }}
                        />
                      </Tooltip>
                    )}
                    {/* Button to set brute as master */}
                    {clan.masterId === brute?.id && clan.masterId !== clanBrute.id && (
                      <Tooltip title={t('setAsClanMaster')}>
                        <PlayCircleOutline
                          onClick={setMaster(clanBrute)}
                          fontSize="small"
                          color="warning"
                          sx={{ mr: 0.5 }}
                        />
                      </Tooltip>
                    )}
                    <Text bold color="secondary" sx={{ display: 'inline' }}>{clanBrute.name}</Text>
                  </Box>
                </Box>
                <Text bold smallCaps color="text.primary">
                  {t('level')}
                  <Text component="span" bold color="secondary"> {clanBrute.level}</Text>
                </Text>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 115 }}>
                  <Box component="img" src={`/images/rankings/lvl_${clanBrute.ranking}.webp`} sx={{ mr: 1 }} />
                  <Text bold color="text.primary" sx={{ lineHeight: 1 }}>{t(`lvl_${clanBrute.ranking as BruteRanking}`)}</Text>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 115,
                  width: 70,
                  height: 1,
                }}
                >
                  <BruteRender
                    brute={clanBrute}
                    looking="left"
                  />
                </Box>
              </Box>
            </StyledButton>
          ))}
        </Box>
        {/* JOIN REQUESTS */}
        {clan.masterId === brute?.id && !!clan.joinRequests.length && (
          <>
            <Text bold h4 sx={{ my: 1 }}>{t('joinRequests')}</Text>
            <Table sx={{
              maxWidth: 1,
              '& th': {
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                py: 0.5,
                px: 1,
                fontWeight: 'bold',
                border: '1px solid',
                borderColor: 'background.default',
              },
              '& td': {
                bgcolor: 'background.paperDark',
                py: 0.5,
                px: 1,
                border: '1px solid',
                borderColor: 'background.default',
              },
            }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>{t('ranking')}</TableCell>
                  <TableCell>{t('brute')}</TableCell>
                  <TableCell align="right">{t('level')}</TableCell>
                  <TableCell align="right">{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clan.joinRequests.map((requester) => (
                  <TableRow
                    key={requester.id}
                  >
                    <TableCell component="th" scope="row">
                      <Box component="img" src={`/images/rankings/lvl_${requester.ranking}.webp`} sx={{ width: 20 }} />
                    </TableCell>
                    <TableCell sx={{ overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box width={40} height={45} mx={1}>
                          <BruteRender
                            brute={requester}
                          />
                        </Box>
                        <Link to={`/${requester.name}/cell`}>
                          <Text bold>{requester.name}</Text>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{t('level')} {requester.level}</TableCell>
                    <TableCell align="right">
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 1,
                        gap: 1,
                      }}
                      >
                        <FantasyButton color="success" onClick={acceptJoin(requester)}>{t('accept')}</FantasyButton>
                        <FantasyButton color="error" onClick={rejectJoin(requester)}>{t('reject')}</FantasyButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Paper>
    </Page>
  );
};

export default ClanView;
