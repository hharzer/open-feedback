import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'
import WarningIcon from '@material-ui/icons/Warning'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    chip: {
        marginBottom: 4,
        maxWidth: '100%',
    },
}))

const TalkListItemSpeakerList = ({
    speakers,
    speakersIds,
    onSpeakerClicked,
}) => {
    const classes = useStyles()
    const { t } = useTranslation()

    if (!speakersIds) {
        return ''
    }

    return speakersIds.map((speakerId) => {
        if (speakers[speakerId]) {
            return (
                <Chip
                    classes={{
                        root: classes.chip,
                    }}
                    key={speakerId}
                    label={speakers[speakerId].name}
                    variant="outlined"
                    onClick={() => onSpeakerClicked(speakers[speakerId].name)}
                    avatar={
                        <Avatar
                            alt={speakers[speakerId].name}
                            src={speakers[speakerId].photoUrl}
                        />
                    }
                />
            )
        } else {
            return (
                <Tooltip title={t('talks.speakerMissing')} key={speakerId}>
                    <Chip
                        label={speakerId}
                        className={classes.chip}
                        variant="outlined"
                        icon={<WarningIcon style={{ width: 20 }} />}
                        classes={{
                            root: classes.chip,
                            label: classes.label,
                        }}
                    />
                </Tooltip>
            )
        }
    })
}

export default TalkListItemSpeakerList
