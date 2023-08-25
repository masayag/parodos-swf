import React from 'react';
import ReactJson from 'react-json-view';

import { InfoCard } from '@backstage/core-components';
import { useTheme } from '@material-ui/core';

interface ProcessVariablesViewerProps {
  variables: Record<string, unknown> | undefined;
}

export const ProcessVariablesViewer = (props: ProcessVariablesViewerProps) => {
  const { variables } = props;
  const theme = useTheme();

  return (
    <InfoCard title="Variables">
      {variables === undefined && <p>No instance selected</p>}
      <div>
        {variables && (
          <ReactJson
            src={variables}
            name={false}
            theme={theme.palette.type === 'dark' ? 'monokai' : 'rjv-default'}
          />
        )}
      </div>
    </InfoCard>
  );
};
