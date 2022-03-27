import {
  TouchDrawer,
  Heading,
  Icon,
  useWindowInfo,
  Button,
  IconButton,
  joinStrings,
  Paragraph
} from './uiKit';
import { noop } from 'lodash/fp';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../SVG/Spinner';
import './Prompt.scss';

type ButtonConfig = {
  text: string;
  onClick?: () => void;
};

type ImageConfig = {
  src: string;
  alt: string;
};

export type PromptProps = {
  /**
   * if true, prompt will display on page
   */
  show: boolean;
  /**
   * Optional. Configuration of prompt image
   */
  image?: ImageConfig;
  /**
   * Optional. Shows a spinner and disables buttons if set to true.
   */
  busy?: boolean;
  /**
   * Text to display in sub-heading
   */
  title: string;
  /**
   * Function to be used on close button click & overlay click
   */
  onClose?: () => void;
  /**
   * Custom className for Prompt
   */
  className?: string;
  /**
   * Configuration for footer actions
   */
  PrimaryButton?: ButtonConfig;
  /**
   * Optional. Configuration for footer actions
   */
  SecondaryButton?: ButtonConfig;
  /**
   * element to have focus on load
   */
  elementToFocusOnOpen?: React.RefObject<HTMLElement>;
  /**
   * Whether to render a close button in the top right. Defaults to true
   */
  hasCloseButton?: boolean;
  /**
   * Prompt cannot be closed via backdrop, close button, or touch/drag.
   */
  cannotClose?: boolean;
  onShow?: () => void;
  /**
   * Unnecessary content
   */
  content?: string;
};

const PromptFooter: FunctionComponent<{
  PrimaryButton: ButtonConfig;
  SecondaryButton?: ButtonConfig;
  busy?: boolean;
}> = ({ PrimaryButton, SecondaryButton, busy }) => {
  return (
    <>
      {SecondaryButton && (
        <Button
          variant='secondary'
          type='button'
          size='large'
          onClick={SecondaryButton.onClick}
          disabled={busy}
        >
          {busy ? <Spinner /> : <>{SecondaryButton.text}</>}
        </Button>
      )}

      <Button
        type='button'
        size='large'
        disabled={busy}
        onClick={PrimaryButton.onClick}
      >
        {busy ? <Spinner /> : <>{PrimaryButton.text}</>}
      </Button>
    </>
  );
};

export const Prompt: FunctionComponent<PromptProps> = ({
  show,
  image,
  busy,
  title,
  onClose,
  children,
  className,
  PrimaryButton,
  SecondaryButton,
  elementToFocusOnOpen,
  hasCloseButton = true,
  cannotClose = false,
  onShow = noop,
  content
}) => {
  const windowInfo = useWindowInfo();
  const isMobileDevice = windowInfo.isBelowDesktopWidth();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      onShow();
    }
  }, [show]);

  return (
    <TouchDrawer
      className={joinStrings(['prompt', className])}
      show={show}
      showTouchPad={!cannotClose}
      showCloseBtn={isMobileDevice && !cannotClose}
      backdropCanClose={!cannotClose}
      allowKeyboardInputs={!cannotClose}
      elementToFocusOnOpen={elementToFocusOnOpen || closeButtonRef}
      onClose={onClose}
      footer={
        PrimaryButton && (
          <PromptFooter
            busy={busy}
            PrimaryButton={PrimaryButton}
            SecondaryButton={SecondaryButton}
          />
        )
      }
      header={
        !isMobileDevice && (
          <div>
            {hasCloseButton && !cannotClose && (
              <div
                role='button'
                aria-label={t('prompt-close-btn-aria-label')}
                aria-hidden='true'
                className='prompt__close-btn'
              >
                <IconButton
                  onClick={onClose}
                  aria-label={t('prompt-close-btn-aria-label')}
                  icon={<Icon variant='Close' />}
                  title='close'
                  ref={closeButtonRef}
                />
              </div>
            )}
          </div>
        )
      }
    >
      {image && (
        <img className='prompt__image' src={image.src} alt={image.alt} />
      )}
      <div className='prompt__content'>
        <Heading className='prompt__heading' noMargin level={5}>
          {title}
        </Heading>
        {content && <Paragraph>{content}</Paragraph>}
        {children}
      </div>
    </TouchDrawer>
  );
};
