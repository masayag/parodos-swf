import React, { useState } from 'react';

import { InfoCard } from '@backstage/core-components';
import { ProcessInstance } from '@parodos/plugin-swf-common';
import { SWFEditor } from '../SWFEditor';
import { EditorViewKind } from '../SWFEditor/SWFEditor';
import { Button } from '@material-ui/core';
import { SWFDialog } from '../SWFDialog';

interface ProcessGraphViewerProps {
  swfId: string | undefined;
  selectedInstance: ProcessInstance | undefined;
}

export const ProcessGraphViewer = (props: ProcessGraphViewerProps) => {
  const { swfId, selectedInstance } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <InfoCard
        title="Status"
        action={
          swfId &&
          selectedInstance && (
            <Button
              color="secondary"
              type="submit"
              variant="contained"
              style={{ marginTop: 8, marginRight: 8 }}
              onClick={() => setOpen(true)}
            >
              Expand
            </Button>
          )
        }
      >
        <div style={{ height: '500px', padding: '10px' }}>
          {!swfId || !selectedInstance ? (
            <p>No instance selected</p>
          ) : (
            <SWFEditor
              kind={EditorViewKind.RUNTIME}
              processInstance={selectedInstance}
              swfId={swfId}
            />
          )}
        </div>
      </InfoCard>
      {swfId && selectedInstance && (
        <SWFDialog
          swfId={swfId}
          kind={EditorViewKind.RUNTIME}
          processInstance={selectedInstance}
          title={selectedInstance.processName ?? selectedInstance.processId}
          open={open}
          close={() => setOpen(false)}
        />
      )}
    </>
  );
};
