import datetime
import logging

from django.core.management.base import BaseCommand

from logs.models import Log

logger = logging.getLogger('logs.enrich_log')


class Command(BaseCommand):
    help = 'Adds end into log table'

    def add_arguments(self, parser):
        parser.add_argument('minutes', nargs=1, type=int)

    def handle(self, *args, **options):
        minutes = options['minutes'][0]
        recent_logs = Log.objects.filter(
            start__gt=datetime.datetime.now(tz=datetime.timezone.utc) - datetime.timedelta(minutes=minutes)
        )
        for log in recent_logs:
            next_log = Log.objects.filter(user__exact=log.user).filter(start__gt=log.start).order_by('start').first()
            if next_log:
                log.end = next_log.start
                log.save()

        logger.debug(f'Successfully enriched {len(recent_logs)} logs')
