import React, { useCallback, useEffect, useState } from 'react';

import { InfoCard, Table } from '@backstage/core-components';
import { swfApiRef } from '../../api';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import { swfInstanceRouteRef } from '../../routes';
import { ProcessInstance } from '@parodos/plugin-swf-common';

interface ProcessInstancesTableProps {
  selectedInstance: ProcessInstance | undefined;
  setSelectedInstance: (instance: ProcessInstance) => void;
}

type Row = {
  pid: string;
  name: string;
  state: string;
};

export const ProcessInstancesTable = (props: ProcessInstancesTableProps) => {
  const swfApi = useApi(swfApiRef);
  const { instanceId } = useRouteRefParams(swfInstanceRouteRef);
  const [data, setData] = useState<Row[]>([]);
  const { selectedInstance, setSelectedInstance } = props;

  const column1 = {
    title: 'Id',
    field: 'pid',
  };

  const column2 = {
    title: 'Name',
    field: 'name',
  };

  const column3 = {
    title: 'State',
    field: 'state',
  };

  useEffect(() => {
    swfApi.getInstances().then(value => {
      const rows: Row[] = value
        .map(pi => {
          return {
            pid: pi.id,
            name: pi.processId,
            state: pi.state,
          };
        })
        .reverse();
      setData(rows);
    });
  }, [swfApi]);

  const loadInstance = useCallback(
    (pid: string | undefined) => {
      if (pid) {
        swfApi.getInstance(pid).then(value => {
          setSelectedInstance(value);
        });
      }
    },
    [swfApi, setSelectedInstance],
  );

  useEffect(() => {
    const selectedRowData = data.find(d => d.pid === instanceId);
    if (selectedRowData) {
      loadInstance(selectedRowData.pid);
    }
  }, [loadInstance, data, instanceId]);

  return (
    <InfoCard title="Instances">
      <div style={{ height: '500px', padding: '10px' }}>
        <Table<Row>
          data={data}
          columns={[column1, column2, column3]}
          onRowClick={(_, rowData) => {
            if (rowData && rowData.pid !== selectedInstance?.id) {
              loadInstance(rowData.pid);
            }
          }}
          options={{
            padding: 'dense',
            rowStyle: (rowData: Row) => {
              return rowData.pid === selectedInstance?.id
                ? { backgroundColor: '#a266e5' }
                : {};
            },
          }}
        />
      </div>
    </InfoCard>
  );
};
