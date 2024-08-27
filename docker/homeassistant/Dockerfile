FROM homeassistant/home-assistant:2024.3 AS compile-image
ARG MRMAP_PRODUCTION
RUN apk update && \
    apk add --no-cache rsync

# Add crontab file in the cron directory
ADD ./docker/homeassistant/crontab /etc/cron.d/backup-sync
ADD ./docker/homeassistant/backup_sync.sh /usr/local/bin/backup.sh

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/backup-sync
RUN chmod 0644 /usr/local/bin/backup.sh

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD /usr/sbin/cron && tail -f /var/log/cron.log