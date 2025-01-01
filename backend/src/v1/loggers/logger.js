'use strict';

const { createLogger, format, transports, level } = require("winston");
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

class MyLogger {
	constructor() {
		const formatPrint = format.printf(
			({ level, message, context, requestId, timestamp, metadata }) => {
				return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
			}
		)

		this.logger = createLogger({
			format: format.combine(
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				formatPrint
			),
			transports: [
				new transports.Console(),
				new transports.DailyRotateFile({
					level: 'info',
					dirname: 'src/v1/logs',
					filename: 'application-%DATE%.info.log',
					datePattern: 'YYYY-MM-DD-HH-mm',
					zippedArchive: true,
					maxSize: '1m',
					maxFiles: '14d',
					format: format.combine(
						format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
						formatPrint
					),
					level: 'info'
				}),
				new transports.DailyRotateFile({
					level: 'info',
					dirname: 'src/v1/logs',
					filename: 'application-%DATE%.error.log',
					datePattern: 'YYYY-MM-DD-HH-mm',
					zippedArchive: true,
					maxSize: '1m',
					maxFiles: '14d',
					format: format.combine(
						format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
						formatPrint
					),
					level: 'error'
				})
			]
		})
	}

	commonParam(params) {
		let context, req, metadata;
		if (!Array.isArray(params)) {
			context = params
		} else {
			[context, req, metadata] = params;
		}
		const requestId = req?.requestId || uuidv4();
		return {
			requestId,
			context,
			metadata
		}
	}

	log(message, param) {
		const paramLog = this.commonParam(param);
		const logObject = Object.assign({ message }, paramLog);

		this.logger.info(logObject);
	}

	error(message, param) {
		const paramLog = this.commonParam(param);
		const logObject = Object.assign({ message }, paramLog);

		this.logger.error(logObject);
	}
}


module.exports = new MyLogger();