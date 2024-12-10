import { StructuredListCell, StructuredListRow, Layer, Row } from '@carbon/react';
import { formatDate, parseDate } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StockOperationDTO } from '../../core/api/types/stockOperation/StockOperationDTO';
import styles from '../stock-operations-table.scss';
import { Tile } from '@carbon/react';
import StockItemsTable from './stock-items-expanded-row/stock-items-table';

interface StockOperationStatusProps {
  model: StockOperationDTO;
}

const StockOperationStatus: React.FC<StockOperationStatusProps> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Layer className={styles.statusContainer}>
        <Row className={styles.statusContainerRow}>
          {props.model?.dateCreated && (
            <div>
              <span className={styles.textHeading}>{t('started', 'Started')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.dateCreated.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.creatorFamilyName} &nbsp;
                  {props.model?.creatorGivenName}
                </span>
              </div>
            </div>
          )}
          {props.model.submittedDate && (
            <div>
              <span className={styles.textHeading}>{t('submitted', 'Submitted')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.submittedDate.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.submittedByFamilyName} &nbsp;
                  {props.model?.submittedByGivenName}
                </span>
              </div>
            </div>
          )}
          {props.model?.dispatchedDate && (
            <div>
              <span className={styles.textHeading}>{t('dispatched', 'Dispatched')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.dispatchedDate.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.dispatchedByFamilyName} &nbsp;
                  {props.model?.dispatchedByGivenName}
                </span>
              </div>
            </div>
          )}
          {props.model?.returnedDate && (
            <div>
              <span className={styles.textHeading}>{t('returned', 'Returned')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.returnedDate.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.returnedByFamilyName} &nbsp;
                  {props.model?.returnedByGivenName}
                </span>
                <span className={styles.text}>{props.model?.returnReason}</span>
              </div>
            </div>
          )}
          {props.model?.completedDate && (
            <div>
              <span className={styles.textHeading}>{t('completed', 'Completed')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.completedDate.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.completedByFamilyName} &nbsp;
                  {props.model?.completedByGivenName}
                </span>
              </div>
            </div>
          )}
          {props.model?.status === 'CANCELLED' && (
            <div>
              <span className={styles.textHeading}>{t('cancelled', 'Cancelled')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.cancelledDate.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.cancelledByFamilyName} &nbsp;
                  {props.model?.cancelledByGivenName}
                  <span className={styles.text}>{props.model?.cancelReason}</span>
                </span>
              </div>
            </div>
          )}
          {props.model?.status === 'REJECTED' && (
            <div>
              <span className={styles.textHeading}>{t('rejected', 'Rejected')}:</span>
              <div className={styles.statusDescriptions}>
                <span className={styles.text}>
                  {formatDate(parseDate(props.model?.rejectedDate.toString()), {
                    time: true,
                    mode: 'standard',
                  })}
                </span>

                <span className={styles.text}>{t('by', 'By')}</span>

                <span className={styles.text}>
                  {props.model?.rejectedByFamilyName} &nbsp;
                  {props.model?.rejectedByGivenName}
                  <span>{props.model?.rejectionReason}</span>
                </span>
              </div>
            </div>
          )}
        </Row>
        <Row className={styles.statusContainerRow}>
          <StockItemsTable items={props.model.stockOperationItems} />
        </Row>
      </Layer>
    </>
  );
};

export default StockOperationStatus;
