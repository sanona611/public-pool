import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { MiningSubmitMessage } from './MiningSubmitMessage';

describe('MiningSubmitMessage', () => {


    beforeEach(async () => {



    });

    describe('test message parsing', () => {

        const MINING_SUBMIT_MESSAGE = ' {"id": 5, "method": "mining.submit", "params": ["tb1qumezefzdeqqwn5zfvgdrhxjzc5ylr39uhuxcz4.bitaxe3", "1", "57a6f0989902000000000000", "64b1f10f", "2402812d", "00006000"]}'

        const message = plainToInstance(
            MiningSubmitMessage,
            JSON.parse(MINING_SUBMIT_MESSAGE),
        );

        it('should parse message', () => {
            expect(message.id).toEqual(5);
            expect(message.userId).toEqual('tb1qumezefzdeqqwn5zfvgdrhxjzc5ylr39uhuxcz4.bitaxe3');
            expect(message.jobId).toEqual('1');
            expect(message.extraNonce).toEqual('9902000000000000');
            expect(message.ntime).toEqual('64b1f10f');
            expect(message.nonce).toEqual('2402812d');
            expect(message.versionMask).toEqual('00006000');
        });

        it('should validate 12-byte ExtraNonce submissions', async () => {
            const errors = await validate(message);

            expect(errors).toEqual([]);
        });

        it('should reject short ExtraNonce submissions', async () => {
            const shortMessage = plainToInstance(
                MiningSubmitMessage,
                JSON.parse(' {"id": 5, "method": "mining.submit", "params": ["tb1qumezefzdeqqwn5zfvgdrhxjzc5ylr39uhuxcz4.bitaxe3", "1", "9902000000000000", "64b1f10f", "2402812d", "00006000"]}'),
            );

            const errors = await validate(shortMessage);

            expect(errors.some(error => error.property === 'extraNonce')).toBe(true);
        });

        it('should reject long ExtraNonce submissions', async () => {
            const longMessage = plainToInstance(
                MiningSubmitMessage,
                JSON.parse(' {"id": 5, "method": "mining.submit", "params": ["tb1qumezefzdeqqwn5zfvgdrhxjzc5ylr39uhuxcz4.bitaxe3", "1", "57a6f09899020000000000000000", "64b1f10f", "2402812d", "00006000"]}'),
            );

            const errors = await validate(longMessage);

            expect(errors.some(error => error.property === 'extraNonce')).toBe(true);
        });
    });


});
