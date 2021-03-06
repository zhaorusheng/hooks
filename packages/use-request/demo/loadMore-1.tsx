/**
 * title: LoadMore default useage
 * desc: If `options.cacheKey` is set, the data will be cached.
 *
 * title.zh-CN: 加载更多基本用法
 * desc.zh-CN: 通过设置 cacheKey，可以缓存所有 list 数据。
 */

import { useBoolean, useRequest } from '@umijs/hooks';
import { Button, Spin, List, Typography } from 'antd';
import React from 'react';


interface Item {
  id?: string,
  name: string
}

interface Result {
  list: Item[],
  nextId: string | undefined
}

const resultData = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export async function getLoadMoreList(nextId: any, limit: any): Promise<Result> {
  let start = 0;
  if (nextId) {
    start = resultData.findIndex(i => i === nextId);
  }
  const end = start + limit;
  const list = resultData.slice(start, end).map(id => ({
    id,
    name: `project ${id} (server time: ${Date.now()})`
  }));
  const nId = resultData.length >= end ? resultData[end] : undefined;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        list,
        nextId: nId
      });
    }, 1000);
  });
}


export default () => {
  const { state, toggle } = useBoolean(true);
  return (
    <div>
      <p>You can click the button multiple times, the loadmore will be cached.</p>
      <p>
        <Button onClick={() => toggle()}>show/hidden</Button>
      </p>
      {state && <LoadMoreComponent />}
    </div>
  )
};

const LoadMoreComponent = () => {
  const { data, loading, loadMore, loadingMore } = useRequest((d: Result | undefined) => getLoadMoreList(d?.nextId, 3), {
    loadMore: true,
    cacheKey: 'loadMoreDemoCacheId',
    fetchKey: d => `${d?.nextId}-`,
  });

  return (
    <div>
      <Spin spinning={loading}>
        <List
          dataSource={data?.list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Typography.Text mark>[{item.id}]</Typography.Text> {item.name}
            </List.Item>
          )}
        />
      </Spin>
      <Button
        onClick={loadMore}
        loading={loadingMore}
        disabled={!data?.nextId}
      >
        click to load more
      </Button>
    </div>
  );
};
