import { Brute } from '@labrute/core';
import { Box, BoxProps, Stack } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CellStats from '../Cell/CellStats';
import Text from '../Text';
import BruteComponent from './Body/BruteComponent';
import BruteHP from './BruteHP';

interface BruteBodyAndStatsProps extends BoxProps {
  brute: Brute;
  isMd?: boolean;
}

const BruteBodyAndStats = ({
  brute,
  isMd,
  ...rest
}: BruteBodyAndStatsProps) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="row" justifyContent={isMd ? 'center' : undefined} {...rest}>
      {/* BRUTE */}
      <BruteComponent
        brute={brute}
        inverted
        sx={{ height: 160 }}
      />
      <Stack spacing={1} flexGrow={isMd ? undefined : 1}>
        {/* HP */}
        <Box>
          <BruteHP hp={brute.data.stats.hp} />
          <Text bold sx={{ display: 'inline-block', ml: 1 }}>{t('healthPoints')}</Text>
        </Box>
        {/* STRENGTH */}
        <CellStats stats={brute.data.stats} stat="strength" />
        {/* AGILITY */}
        <CellStats stats={brute.data.stats} stat="agility" />
        {/* SPEED */}
        <CellStats stats={brute.data.stats} stat="speed" />
      </Stack>
    </Box>
  );
};

export default BruteBodyAndStats;
