DROP TRIGGER IF EXISTS note_details_changes ON note_details;
DROP FUNCTION IF EXISTS notify_note_details_changes();

CREATE OR REPLACE FUNCTION notify_note_details_changes()
RETURNS TRIGGER AS $$
DECLARE
    payload JSON;
BEGIN
    payload = json_build_object(
        'operation', TG_OP,
        'table', TG_TABLE_NAME,
        'id', COALESCE(NEW.id, OLD.id),
        'new_data', json_build_object(
            'id', COALESCE(NEW.id, OLD.id),
            'type', COALESCE(NEW.type, OLD.type),
            'title', COALESCE(NEW.title, OLD.title),
            'schedule_time', COALESCE(NEW.schedule_time, OLD.schedule_time),
            'user_id', COALESCE(NEW.user_id, OLD.user_id)
        )
    );

    PERFORM pg_notify('note_detail_channel', payload::TEXT);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER note_details_changes
AFTER INSERT OR UPDATE OR DELETE
ON note_details
FOR EACH ROW
EXECUTE FUNCTION notify_note_details_changes();
