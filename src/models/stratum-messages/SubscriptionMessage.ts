import { Expose, Transform } from 'class-transformer';
import { IsArray, IsString, MaxLength } from 'class-validator';

import { eRequestMethod } from '../enums/eRequestMethod';
import { EXTRANONCE_PREFIX_SIZE_BYTES, TOTAL_EXTRANONCE_SIZE_BYTES } from '../stratum.constants';
import { StratumBaseMessage } from './StratumBaseMessage';

export class SubscriptionMessage extends StratumBaseMessage {


    @IsArray()
    params: string[];

    @Expose()
    @IsString()
    @MaxLength(128)
    @Transform(({ value, key, obj, type }) => {
        return obj?.params?.[0] == null ? 'unknown' : SubscriptionMessage.refineUserAgent(obj.params[0]);
    })
    public userAgent: string;

    constructor() {
        super();
        this.method = eRequestMethod.SUBSCRIBE;
    }

    public response(clientId: string) {
        return {
            id: this.id,
            error: null,
            result: [
                [
                    ['mining.notify', clientId]
                ],
                clientId + '00'.repeat(TOTAL_EXTRANONCE_SIZE_BYTES - EXTRANONCE_PREFIX_SIZE_BYTES), // Single 12-byte field: unique prefix plus 8-byte counter initialized to zero.
                0 // No separate extranonce2; the complete 12-byte value is submitted by the miner.
            ]
        }


    }

    public static refineUserAgent(userAgent: string): string {
        // return userAgent;
        userAgent = userAgent.split(' ')[0].split('/')[0].split('V')[0].split('-')[0];

        if (userAgent.includes('bosminer') || userAgent.includes('bOS')) {
            userAgent = 'Braiins OS';
        } else if (userAgent.includes('cpuminer')) {
            userAgent = 'cpuminer';
        }
        return userAgent;
    }
}
