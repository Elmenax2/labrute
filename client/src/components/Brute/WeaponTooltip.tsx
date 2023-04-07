import { PERKS_TOTAL_ODDS, StatColor, Weapon, WeaponTypeColor } from '@labrute/core';
import { Box, Tooltip, TooltipProps } from '@mui/material';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Text from '../Text';

export interface WeaponTooltipProps extends Omit<TooltipProps, 'title'> {
  weapon?: Weapon;
}

const WeaponTooltip = ({
  weapon,
  children,
  ...rest
}: WeaponTooltipProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      {...rest}
      title={weapon ? (
        <>
          <Box sx={{ textAlign: 'center', my: 0.5 }}>
            {/* NAME */}
            <Text typo="Blocky" sx={{ fontSize: 13 }}>{t(weapon.name)}</Text>
            {/* ILLUSTRATION */}
            <Box
              component="img"
              src={`/images/weapons/${weapon.name}.png`}
              sx={{ display: 'inline-block', filter: 'drop-shadow(2px 2px 2px #000)' }}
            />
          </Box>
          {/* TYPES */}
          <Text typo="Blocky">
            {t('types')}:
            {' '}
            {weapon.types.map((type, index) => (
              <Fragment key={type}>
                <Box
                  component="span"
                  sx={{ color: WeaponTypeColor[type], textTransform: 'capitalize' }}
                >
                  {t(type)}
                </Box>
                {index < weapon.types.length - 1 && ', '}
              </Fragment>
            ))}
          </Text>
          {/* ODDS */}
          <Text typo="Blocky">
            {t('odds')}:
            {' '}
            <Box component="span" sx={{ opacity: 0.7 }}>
              {((weapon.odds / PERKS_TOTAL_ODDS) * 100).toFixed(2)}%
            </Box>
          </Text>
          {/* INTERVAL */}
          <Text typo="Blocky">
            {t('interval')}:
            {' '}
            <Box component="span" sx={{ opacity: 0.7 }}>
              {Math.round(weapon.tempo * 100)}
            </Box>
          </Text>
          {/* DAMAGE */}
          <Text typo="Blocky">
            {t('damage')}:
            {' '}
            <Box component="span" sx={{ color: StatColor.damage }}>
              {weapon.damage}
            </Box>
          </Text>
          {/* DRAW CHANCE */}
          <Text typo="Blocky">
            {t('drawChance')}:
            {' '}
            <Box component="span" sx={{ opacity: 0.7 }}>
              {weapon.toss}
            </Box>
          </Text>
          {/* REACH */}
          <Text typo="Blocky">
            {t('reach')}:
            {' '}
            <Box component="span" sx={{ opacity: 0.7 }}>
              {weapon.reach}
            </Box>
          </Text>
          {/* COUNTER */}
          {!!weapon.counter && (
            <Text typo="Blocky" sx={{ color: StatColor.counter }}>
              {weapon.counter > 0 && '+'}
              {Math.round(weapon.counter * 100)}
              % {t('counter')}
            </Text>
          )}
          {/* EVASION */}
          {!!weapon.evasion && (
            <Text typo="Blocky" sx={{ color: StatColor.evasion }}>
              {weapon.evasion > 0 && '+'}
              {Math.round(weapon.evasion * 100)}
              % {t('evasion')}
            </Text>
          )}
          {/* BLOCK */}
          {!!weapon.block && (
            <Text typo="Blocky" sx={{ color: StatColor.block }}>
              {weapon.block > 0 && '+'}
              {Math.round(weapon.block * 100)}
              % {t('block')}
            </Text>
          )}
          {/* ACCURACY */}
          {!!weapon.accuracy && (
            <Text typo="Blocky" sx={{ color: StatColor.accuracy }}>
              {weapon.accuracy > 0 && '+'}
              {Math.round(weapon.accuracy * 100)}
              % {t('accuracy')}
            </Text>
          )}
          {/* DISARM */}
          {!!weapon.disarm && (
            <Text typo="Blocky" sx={{ color: StatColor.disarm }}>
              {weapon.disarm > 0 && '+'}
              {Math.round(weapon.disarm * 100)}
              % {t('disarm')}
            </Text>
          )}
          {/* COMBO */}
          {!!weapon.combo && (
            <Text typo="Blocky" sx={{ color: StatColor.combo }}>
              {weapon.combo > 0 && '+'}
              {Math.round(weapon.combo * 100)}
              % {t('combo')}
            </Text>
          )}
        </>
      ) : ''}
      componentsProps={{
        tooltip: {
          sx: {
            minHeight: 68,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            border: 2,
            borderColor: 'primary.main',
          }
        },
        popper: { sx: { width: 250 } },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default WeaponTooltip;