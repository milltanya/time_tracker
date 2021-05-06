require 'spec_helper'

describe 'Time tracker' do

  describe package('postgresql') do
    it { should be_installed.with_version('13+225.pgdg20.04+1') }
  end

  describe package('python3.8') do
    it { should be_installed.with_version('3.8.5-1~20.04.2') }
  end

  describe package('python3-pip') do
    it { should be_installed.with_version('20.0.2-5ubuntu1.3') } 
  end

  describe package('python3-venv') do
    it { should be_installed.with_version('3.8.2-0ubuntu2') }
  end

  describe package('django') do
    it { should be_installed.by('pip3').with_version('3.2') }
  end

  describe package('django-cors-headers') do
    it { should be_installed.by('pip3').with_version('3.7.0') }
  end

  describe package('djangorestframework') do
    it { should be_installed.by('pip3').with_version('3.12.4') }
  end

  describe package('libpq-dev') do
    it { should be_installed.with_version('13.2-1.pgdg20.04+1') }
  end

  describe package('wheel') do
    it { should be_installed.by('pip3').with_version('0.34.2') }
  end

  describe package('psycopg2') do
    it { should be_installed.by('pip3').with_version('2.8.6') }
  end

  describe package('google-chrome-stable') do
    it { should be_installed.with_version('90.0.4430.93-1') }
  end

end
