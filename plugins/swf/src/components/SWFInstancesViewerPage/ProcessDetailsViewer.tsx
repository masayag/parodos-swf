import React, { useMemo } from 'react';

import { InfoCard } from '@backstage/core-components';
import { Button, Link, Typography } from '@material-ui/core';
import Moment from 'react-moment';
import PlayCircleFilledWhiteRoundedIcon from '@material-ui/icons/PlayCircleFilledWhiteRounded';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import PauseCircleFilledRoundedIcon from '@material-ui/icons/PauseCircleFilledRounded';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import ItemDescriptor from './ItemDescriptor';
import {
  ProcessInstance,
  ProcessInstanceState,
} from '@parodos/plugin-swf-common';
import LaunchIcon from '@material-ui/icons/Launch';

interface ProcessDetailsViewerProps {
  selectedInstance: ProcessInstance | undefined;
}

const processInstanceIconCreator = (state: string) => {
  const render = (icon: JSX.Element, text: string) => {
    return (
      <p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {icon}
          <span style={{ paddingLeft: '8px' }}>{text}</span>
        </div>
      </p>
    );
  };

  switch (state) {
    case ProcessInstanceState.Active:
      return render(<PlayCircleFilledWhiteRoundedIcon />, 'Active');
    case ProcessInstanceState.Completed:
      return render(<CheckCircleIcon htmlColor="#3e8635" />, 'Complete');
    case ProcessInstanceState.Aborted:
      return render(<RemoveCircleRoundedIcon />, 'Aborted');
    case ProcessInstanceState.Suspended:
      return render(<PauseCircleFilledRoundedIcon />, 'Suspended');
    case ProcessInstanceState.Error:
      return render(<CancelOutlinedIcon color="error" />, 'Error');
    default:
      return <></>;
  }
};

const getProcessInstanceDescription = (processInstance: any) => {
  return {
    id: processInstance.id,
    name: processInstance.processName,
    description: processInstance.businessKey,
  };
};

export const ProcessDetailsViewer = (props: ProcessDetailsViewerProps) => {
  const { selectedInstance } = props;

  const errorInfo = useMemo(() => {
    if (!selectedInstance?.error?.message) {
      return null;
    }
    const nodeName = selectedInstance.nodes.find(
      n => n.definitionId === selectedInstance?.error?.nodeDefinitionId,
    )?.name;
    return (
      <>
        {nodeName && (
          <>
            <Typography variant="caption" style={{ fontWeight: 'bold' }}>
              Node with error
            </Typography>
            <p>{nodeName}</p>
          </>
        )}
        <Typography variant="caption" style={{ fontWeight: 'bold' }}>
          Error message
        </Typography>
        <p>{selectedInstance.error.message}</p>
      </>
    );
  }, [selectedInstance]);

  return (
    <InfoCard title="Details">
      {selectedInstance === undefined && <p>No instance selected</p>}
      {selectedInstance && (
        <div>
          <Typography variant="caption" style={{ fontWeight: 'bold' }}>
            Id
          </Typography>
          <p>{selectedInstance?.id}</p>
          <Typography variant="caption" style={{ fontWeight: 'bold' }}>
            Name
          </Typography>
          <p>{selectedInstance?.processName}</p>
          {selectedInstance.businessKey && (
            <>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                Business key
              </Typography>
              <p>{selectedInstance?.businessKey}</p>
            </>
          )}
          <Typography variant="caption" style={{ fontWeight: 'bold' }}>
            State
          </Typography>
          {processInstanceIconCreator(selectedInstance.state)}
          {errorInfo}
          {selectedInstance.serviceUrl && (
            <>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                Endpoint
              </Typography>
              <Link href={selectedInstance.serviceUrl} target="_blank">
                {selectedInstance.serviceUrl}
              </Link>
              <LaunchIcon />
            </>
          )}
          {selectedInstance.start && (
            <div>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                Start
              </Typography>
              <p>
                <Moment fromNow>{new Date(`${selectedInstance.start}`)}</Moment>
              </p>
            </div>
          )}
          {selectedInstance.lastUpdate && (
            <div>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                Last Updated
              </Typography>
              <p>
                <Moment fromNow>
                  {new Date(`${selectedInstance.lastUpdate}`)}
                </Moment>
              </p>
            </div>
          )}
          {selectedInstance.end && (
            <div>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                End
              </Typography>
              <p>
                <Moment fromNow>{new Date(`${selectedInstance.end}`)}</Moment>
              </p>
            </div>
          )}
          {selectedInstance.parentProcessInstance && (
            <>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                Parent Process
              </Typography>
              <div>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  disabled
                >
                  <ItemDescriptor
                    itemDescription={getProcessInstanceDescription(
                      selectedInstance.parentProcessInstance,
                    )}
                  />
                </Button>
              </div>
            </>
          )}
          {selectedInstance?.childProcessInstances?.length && (
            <>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                Sub Processes
              </Typography>
              {selectedInstance?.childProcessInstances?.map(child => (
                <div key={child.id}>
                  <Button
                    variant="contained"
                    startIcon={<GetAppIcon />}
                    disabled
                  >
                    <ItemDescriptor
                      itemDescription={getProcessInstanceDescription(child)}
                    />
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </InfoCard>
  );
};
