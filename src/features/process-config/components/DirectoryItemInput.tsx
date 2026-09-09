/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Button, FormHelperText, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCallback, useMemo, useState } from 'react';
import {
    DIRECTORY_ITEM_FULL_PATH,
    DIRECTORY_ITEM_ID,
    DirectoryItemSchema,
    DirectoryItemSelector,
    DirectoryItemSelectorProps,
    getAbsenceLabelKeyFromType,
    TreeViewFinderNodeProps,
} from '@gridsuite/commons-ui';
import { useController } from 'react-hook-form';
import { UUID } from 'node:crypto';

export interface DirectoryItemSelectorInputProps extends Omit<DirectoryItemSelectorProps, 'onClose' | 'open'> {
    name: string;
}

export default function DirectoryItemInput({ name, types, ...props }: Readonly<DirectoryItemSelectorInputProps>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({ name });

    const selectedfolder: DirectoryItemSchema | undefined | null = value;
    const intl = useIntl();

    const path = useMemo(() => {
        return selectedfolder?.[DIRECTORY_ITEM_FULL_PATH] ? selectedfolder[DIRECTORY_ITEM_FULL_PATH] : undefined;
    }, [selectedfolder]);

    const onSelectFolder = useCallback(
        (folders: TreeViewFinderNodeProps[]) => {
            if (folders.length > 0) {
                const folder = folders[0];

                if (!folder) {
                    return;
                }
                const parentNames = folder.parents?.map((parent) => parent.name) ?? [];

                const fullPath = [...parentNames, folder.name].join(' / ');
                const folderId: UUID | null = folders[0]?.id;
                if (folderId) {
                    const newFolder = {
                        [DIRECTORY_ITEM_ID]: folderId,
                        [DIRECTORY_ITEM_FULL_PATH]: fullPath,
                    };
                    onChange(newFolder);
                }
            }
            setIsOpen(false);
        },
        [onChange]
    );

    const [head, tail] = useMemo(() => {
        if (!path) return ['', ''];
        const i = path.lastIndexOf(' / ');
        return i === -1 ? [path, ''] : [path.slice(0, i), path.slice(i)];
    }, [path]);

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Grid container alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                    <Grid
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <FolderOutlined />
                    </Grid>
                    <Grid size={{ xs: 'grow', sm: 8 }} sx={{ minWidth: 0, paddingLeft: 1 }}>
                        <Tooltip
                            title={path}
                            slotProps={{
                                tooltip: {
                                    sx: {
                                        maxWidth: 'none',
                                    },
                                },
                            }}
                        >
                            {path ? (
                                <Box sx={{ display: 'flex', minWidth: 0, overflow: 'hidden' }} aria-label={path}>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    >
                                        {head}
                                    </Typography>
                                    <Typography component="span" variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                        {tail}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" noWrap>
                                    <FormattedMessage id={getAbsenceLabelKeyFromType(types?.[0])} />
                                </Typography>
                            )}
                        </Tooltip>
                    </Grid>
                    <Grid paddingTop={1} paddingLeft={1}>
                        {error?.message && (
                            <FormHelperText error>{intl.formatMessage({ id: error?.message })}</FormHelperText>
                        )}
                    </Grid>
                </Grid>

                <Button
                    variant="outlined"
                    onClick={() => setIsOpen(true)}
                    component="label"
                    sx={{
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <FormattedMessage id={path ? 'edit' : 'Select'} />
                </Button>
            </Stack>
            <DirectoryItemSelector open={isOpen} onClose={onSelectFolder} types={types} {...props} />
        </Box>
    );
}
