














import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { swfApiRef } from '../../api';
import { SwfItem } from '@parodos/plugin-swf-common';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Pageview from '@material-ui/icons/Pageview';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Subscriptions from '@material-ui/icons/Subscriptions';
import Edit from '@material-ui/icons/Edit';
import {
  definitionsRouteRef,
  editWorkflowRouteRef,
  scaffolderTemplateSelectedRouteRef,
  swfInstancesRouteRef,
} from '../../routes';
import { useNavigate } from 'react-router-dom';

type SwfItemsTableProps = {
  items: SwfItem[];
};

export const SwfItemsTable = ({ items }: SwfItemsTableProps) => {
  const swfApi = useApi(swfApiRef);

  const navigate = useNavigate();
  const definitionLink = useRouteRef(definitionsRouteRef);
  const scaffolderLink = useRouteRef(scaffolderTemplateSelectedRouteRef);
  const instancesLink = useRouteRef(swfInstancesRouteRef);
  const editLink = useRouteRef(editWorkflowRouteRef);

  interface Row {
    id: string;
    name: string;
  }

  const columns: TableColumn[] = [{ title: 'Name', field: 'name' }];
  const data: Row[] = items.map(item => {
    return {
      id: item.id,
      name: item.name,
    };
  });

  const doView = (rowData: Row) => {
    navigate(definitionLink({ swfId: rowData.id }));
  };

  const doExecute = (rowData: Row) => {
    if (scaffolderLink) {
      navigate(
        scaffolderLink({ namespace: 'default', templateName: `${rowData.id}` }),
      );
    }
  };

  const doInstances = (_: Row) => {
    navigate(instancesLink());
  };

  const doEdit = (rowData: Row) => {
    navigate(editLink({ swfId: `${rowData.id}` }));
  };

  const doDelete = (rowData: Row) => {
    // Lazy use of window.confirm vs writing a popup.
    // eslint-disable-next-line no-alert
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        `Please confirm you want to delete '${rowData.id}' permanently.`,
      )
    ) {
      swfApi.deleteWorkflowDefinition(rowData.id);
    }
  };

  return (
    <Table
      title="Definitions"
      options={{ search: false, paging: false, actionsColumnIndex: 1 }}
      columns={columns}
      data={data}
      actions={[
        {
          icon: () => <PlayArrow />,
          tooltip: 'Execute',
          onClick: (_, rowData) => doExecute(rowData as Row),
        },
        {
          icon: () => <Subscriptions />,
          tooltip: 'Instances',
          onClick: (_, rowData) => doInstances(rowData as Row),
        },
        {
          icon: () => <Pageview />,
          tooltip: 'View',
          onClick: (_, rowData) => doView(rowData as Row),
        },
        {
          icon: () => <Edit />,
          tooltip: 'Edit',
          onClick: (_, rowData) => doEdit(rowData as Row),
        },
        {
          icon: () => <DeleteForever />,
          tooltip: 'Delete',
          onClick: (_, rowData) => doDelete(rowData as Row),
        },
      ]}
    />
  );
};

export const SWFDefinitionsListComponent = () => {
  const swfApi = useApi(swfApiRef);
  const { value, error, loading } = useAsync(async (): Promise<SwfItem[]> => {
    const data = await swfApi.listSwfs();
    return data.items;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <SwfItemsTable items={value || []} />;
};
